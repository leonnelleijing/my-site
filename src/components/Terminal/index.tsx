import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Tone = 'muted' | 'ok' | 'key' | 'accent' | 'warn';

type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string; tone?: Tone };

const out = (text: string, tone?: Tone): Line => ({ kind: 'out', text, tone });
const blank = out('');

/** Auto-played opening session. Once it finishes the prompt is handed over to
 *  the visitor, so keep it short — it is a demo of the shell, not the content. */
const INTRO: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  out('LEI Jing — Fullstack Developer, Paris 🇫🇷', 'ok'),
  blank,
  { kind: 'cmd', text: 'help' },
];

const FILES: Record<string, Line[]> = {
  'stack.json': [
    out('{'),
    out('  "backend":  ["Spring Boot", "Node.js", "Golang"],', 'key'),
    out('  "frontend": ["Angular", "Vue.js", "React"],', 'key'),
    out('  "mobile":   ["React Native", "Ionic"],', 'key'),
    out('  "devops":   ["Kubernetes", "Terraform", "Helm", "Ansible", "Azure"],', 'key'),
    out('  "data":     ["PostgreSQL", "MongoDB"]', 'key'),
    out('}'),
  ],
  'experience.md': [
    out('# Experience', 'accent'),
    blank,
    out('## Project Engineer — Actemium Paris Transport', 'ok'),
    out('   Apr 2025 – Present · Paris, France', 'muted'),
    out('   Spring Boot · Vue.js · Golang · Kubernetes · Gitlab CI · Terraform · Ansible'),
    blank,
    out('## Fullstack Developer — Talan', 'ok'),
    out('   Oct 2021 – Apr 2025 · Toulouse, France', 'muted'),
    out('   Air France    → Spring Boot · Angular · Ionic · Kubernetes · Azure'),
    out('   Pierre Fabre  → Java · Groovy · Pricefx'),
  ],
  'contact.txt': [
    out('email   leonleijing@gmail.com', 'accent'),
    out('github  github.com/leonnelleijing', 'accent'),
    out("run 'cv' to open the PDF, or 'contact' to jump to the form", 'muted'),
  ],
};

const HELP: Line[] = [
  out('Available commands', 'accent'),
  blank,
  out('  whoami        who you are talking to'),
  out('  stack         the technology stack'),
  out('  experience    roles and clients'),
  out('  ls            list files'),
  out('  cat <file>    print a file'),
  out('  deployments   current project "pods"'),
  out('  blog          go to the blog'),
  out('  docs          go to the notes'),
  out('  cv            open the CV (PDF)'),
  out('  contact       jump to the contact section'),
  out('  theme         toggle light / dark'),
  out('  date          today'),
  out('  clear         clear the screen'),
  out('  help          this list'),
  blank,
  out('↑ / ↓ walks history · Tab completes · type and press Enter', 'muted'),
];

const COMMANDS = [
  'whoami', 'stack', 'experience', 'ls', 'cat', 'deployments', 'blog', 'docs',
  'cv', 'contact', 'theme', 'date', 'clear', 'help',
];

const TYPE_MS = 26;
const OUT_MS = 85;
const CMD_PAUSE_MS = 380;

export default function Terminal(): React.ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipRef = useRef<(() => void) | null>(null);

  const [done, setDone] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  const router = useHistory();
  const { colorMode, setColorMode } = useColorMode();
  const cvUrl = useBaseUrl('/pdf/CV_Developer.pdf');
  const blogUrl = useBaseUrl('/blog');
  const docsUrl = useBaseUrl('/docs/ai/langchain');

  /* ---------------------------------------------------------------- intro */
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const finish = () => {
      setTyping(null);
      setDone([...INTRO, ...HELP]);
      setReady(true);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    // Clicking during the intro skips straight to the prompt.
    skipRef.current = () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      finish();
    };

    const run = async () => {
      for (const line of INTRO) {
        if (cancelled) return;
        if (line.kind === 'out') {
          await wait(OUT_MS);
          if (cancelled) return;
          setDone((d) => [...d, line]);
          continue;
        }
        for (let i = 1; i <= line.text.length; i += 1) {
          if (cancelled) return;
          setTyping(line.text.slice(0, i));
          await wait(TYPE_MS);
        }
        if (cancelled) return;
        setTyping(null);
        setDone((d) => [...d, line]);
        await wait(CMD_PAUSE_MS);
      }
      for (const line of HELP) {
        if (cancelled) return;
        await wait(OUT_MS / 2);
        if (cancelled) return;
        setDone((d) => [...d, line]);
      }
      if (!cancelled) {
        cancelled = true;
        setReady(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void run();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      skipRef.current = null;
      observer.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [done, typing, ready]);

  /* -------------------------------------------------------------- commands */
  const execute = useCallback(
    (raw: string): Line[] => {
      const input = raw.trim();
      if (!input) return [];
      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(' ');

      switch (cmd.toLowerCase()) {
        case 'help':
          return HELP;
        case 'whoami':
          return [
            out('LEI Jing — Fullstack Developer, Paris 🇫🇷', 'ok'),
            out('Backend architecture through to the interface people actually touch.', 'muted'),
          ];
        case 'stack':
          return FILES['stack.json'];
        case 'experience':
          return FILES['experience.md'];
        case 'ls':
          return [out(Object.keys(FILES).join('   '), 'key')];
        case 'cat': {
          if (!arg) return [out('cat: missing file operand', 'warn'), out("try 'ls'", 'muted')];
          const file = FILES[arg];
          return file ?? [out(`cat: ${arg}: No such file or directory`, 'warn')];
        }
        case 'deployments':
          return [
            out('NAME                 READY   STATUS    AGE', 'muted'),
            out('actemium-transport   3/3     Running   now', 'ok'),
            out('air-france-api       2/2     Running   4y', 'ok'),
            out('pierre-fabre-svc     2/2     Running   3y', 'ok'),
          ];
        case 'date':
          return [out(new Date().toString(), 'muted')];
        case 'theme': {
          const next = colorMode === 'dark' ? 'light' : 'dark';
          setColorMode(next);
          return [out(`theme → ${next}`, 'accent')];
        }
        case 'cv':
          window.open(cvUrl, '_blank', 'noopener,noreferrer');
          return [out('opening CV_Developer.pdf …', 'accent')];
        case 'blog':
          router.push(blogUrl);
          return [out(`navigating to ${blogUrl} …`, 'accent')];
        case 'docs':
          router.push(docsUrl);
          return [out(`navigating to ${docsUrl} …`, 'accent')];
        case 'contact':
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          return [out('scrolling to the contact section …', 'accent')];
        case 'sudo':
          return [out('nice try 🙂', 'warn')];
        case 'echo':
          return [out(arg)];
        case 'clear':
          return [];
        default:
          return [
            out(`zsh: command not found: ${cmd}`, 'warn'),
            out("type 'help' to see what this shell knows", 'muted'),
          ];
      }
    },
    [blogUrl, colorMode, cvUrl, docsUrl, router, setColorMode],
  );

  const submit = () => {
    const raw = value;
    setValue('');
    setHistIdx(null);
    if (raw.trim()) setHistory((h) => [...h, raw.trim()]);

    if (raw.trim().toLowerCase() === 'clear') {
      setDone([]);
      return;
    }
    setDone((d) => [...d, { kind: 'cmd', text: raw }, ...execute(raw)]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setValue(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === null) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(null);
        setValue('');
      } else {
        setHistIdx(next);
        setValue(history[next]);
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = value.split(/\s+/);
      if (parts.length === 1) {
        const hit = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
        if (hit.length === 1) setValue(hit[0] + ' ');
      } else if (parts[0].toLowerCase() === 'cat') {
        const hit = Object.keys(FILES).filter((f) => f.startsWith(parts[1] ?? ''));
        if (hit.length === 1) setValue(`cat ${hit[0]}`);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className="term"
      onClick={() => {
        if (!ready) skipRef.current?.();
        else inputRef.current?.focus();
      }}>
      <div className="term-bar">
        <span className="term-dot term-dot-red" />
        <span className="term-dot term-dot-amber" />
        <span className="term-dot term-dot-green" />
        <span className="term-title">lei@portfolio — zsh</span>
      </div>

      <div ref={bodyRef} className="term-body">
        <div aria-live="polite">
          {done.map((line, i) =>
            line.kind === 'cmd' ? (
              <div key={i} className="term-line">
                <span className="term-prompt">➜</span>
                <span className="term-cmd">{line.text}</span>
              </div>
            ) : (
              <div key={i} className={`term-line term-out term-${line.tone ?? 'plain'}`}>
                {line.text || ' '}
              </div>
            ),
          )}
        </div>

        {typing !== null && (
          <div className="term-line">
            <span className="term-prompt">➜</span>
            <span className="term-cmd">{typing}</span>
            <span className="term-cursor" />
          </div>
        )}

        {ready && (
          <form
            className="term-line term-input-line"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}>
            <span className="term-prompt">➜</span>
            <input
              ref={inputRef}
              className="term-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input — type help for available commands"
              placeholder="type a command, e.g. help"
            />
          </form>
        )}
      </div>
    </div>
  );
}
