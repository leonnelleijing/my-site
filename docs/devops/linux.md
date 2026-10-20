---
title: Linux
sidebar_label: Linux
---

# Linux

Day-to-day Linux commands for DevOps work: files, permissions, processes, services, networking, and text processing.

# Filesystem layout

| Path | Contents |
|---|---|
| `/etc` | system configuration |
| `/var/log` | logs |
| `/var/lib` | application state (e.g. `/var/lib/kubelet`, `/var/lib/docker`) |
| `/usr/bin`, `/usr/local/bin` | binaries |
| `/home/<user>`, `/root` | home directories |
| `/tmp` | temporary files (often cleared on reboot) |
| `/proc`, `/sys` | virtual filesystems exposing kernel and process info |
| `/dev` | device files |

```bash
pwd                      # current directory
ls -lah                  # long listing, hidden files, human sizes
cd -                     # back to previous directory
mkdir -p a/b/c           # create nested directories
cp -r src/ dst/          # copy recursively
mv old new               # move / rename
rm -rf dir/              # delete recursively (careful!)
ln -s /path/target link  # symbolic link
find / -name "*.conf" -mtime -1 2>/dev/null   # .conf files changed in the last day
du -sh * | sort -h       # size of each entry, sorted
df -h                    # free disk space per mount
```

# Permissions

```text
-rwxr-x---  1 alice devops  4096  app.sh
│└┬┘└┬┘└┬┘
│ │  │  └── others: no access
│ │  └───── group : read + execute
│ └──────── owner : read + write + execute
└────────── type  : - file, d directory, l link
```

Each triple is a 3-bit number: `r=4`, `w=2`, `x=1`.

| Mode | Meaning | Typical use |
|---|---|---|
| `600` | `rw-------` | private keys, kubeconfig |
| `644` | `rw-r--r--` | normal config files |
| `700` | `rwx------` | private directories (`~/.ssh`) |
| `755` | `rwxr-xr-x` | scripts and binaries |

```bash
chmod 600 ~/.ssh/id_ed25519
chmod u+x deploy.sh           # add execute for owner
chown -R app:app /opt/app     # change owner and group
umask 027                     # default: new files 640, new dirs 750
```

**Special bits**

| Bit | Effect |
|---|---|
| **setuid** (`chmod u+s`, `4xxx`) | file runs as its **owner** (e.g. `passwd` runs as root) |
| **setgid** (`2xxx`) | runs as the group / new files in a dir inherit the group |
| **sticky** (`1xxx`) | in a shared dir, only the owner can delete their files (`/tmp`) |

Find setuid binaries (a common hardening check):

```bash
find / -perm -4000 -type f 2>/dev/null
```

# sudo and `sudo tee`

`sudo echo "x" > /etc/file` **fails**: the redirection `>` is done by *your* shell, which isn't root. Use `tee`, which runs as root and writes the file:

```bash
echo "net.ipv4.ip_forward = 1" | sudo tee /etc/sysctl.d/99-k8s.conf      # overwrite
echo "10.0.0.5 registry.local" | sudo tee -a /etc/hosts                 # append
echo "secret" | sudo tee /etc/app/token > /dev/null                     # don't echo to terminal
```

Multi-line file with a heredoc:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
```

Other `sudo` essentials:

```bash
sudo -i                  # root login shell
sudo -u postgres psql    # run as another user
sudo -l                  # what am I allowed to run?
sudo visudo              # edit /etc/sudoers safely (syntax checked)
```

# Users and groups

```bash
id                              # my uid, gid, groups
sudo useradd -m -s /bin/bash bob
sudo passwd bob
sudo usermod -aG docker bob     # add to a group (-a = append, don't forget it!)
sudo userdel -r bob             # delete user and home
getent passwd bob               # look up a user
cat /etc/group | grep docker
```

# Processes

```bash
ps aux | grep nginx          # all processes
ps -ef --forest              # process tree
top / htop                   # live view
pgrep -a java                # PIDs + command line by name
kill <pid>                   # SIGTERM: ask nicely
kill -9 <pid>                # SIGKILL: force
pkill -f "python app.py"     # kill by full command line
nohup ./job.sh &             # keep running after logout
jobs; fg %1; bg %1           # job control
```

| Signal | Number | Meaning |
|---|---|---|
| `SIGHUP` | 1 | reload config (by convention) |
| `SIGINT` | 2 | Ctrl+C |
| `SIGKILL` | 9 | kill immediately, can't be caught |
| `SIGTERM` | 15 | graceful stop (what Kubernetes sends first) |

Find which process uses a port or file:

```bash
sudo ss -tlnp | grep 8080     # listening TCP sockets with process
sudo lsof -i :8080
sudo lsof /var/log/app.log
```

# systemd services

```bash
systemctl status kubelet
sudo systemctl start|stop|restart|reload nginx
sudo systemctl enable --now containerd   # start now and at boot
sudo systemctl disable --now cups        # stop and don't start at boot
systemctl list-units --type=service --state=running
sudo systemctl daemon-reload             # after editing a unit file
```

A minimal unit file, `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My app
After=network-online.target

[Service]
User=app
ExecStart=/opt/myapp/bin/server --port 8080
Restart=on-failure
NoNewPrivileges=true
ProtectSystem=strict

[Install]
WantedBy=multi-user.target
```

## Logs with journalctl

```bash
journalctl -u kubelet -f              # follow a unit's logs
journalctl -u kubelet --since "10 min ago"
journalctl -p err -b                  # errors since last boot
journalctl --disk-usage
```

# Networking

```bash
ip a                         # interfaces and IPs
ip r                         # routing table
ss -tulnp                    # listening ports (TCP+UDP) with processes
ping -c 3 10.0.0.1
traceroute example.com
dig +short example.com       # DNS lookup
nslookup kubernetes.default  # DNS (inside a pod)
curl -v https://example.com  # request with headers / TLS details
curl -sk https://localhost:6443/healthz
nc -zv db 5432               # is a TCP port open?
cat /etc/resolv.conf         # DNS servers
```

Check a TLS certificate:

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null \
  | openssl x509 -noout -subject -issuer -dates
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -text
```

# Text processing

| Tool | Use |
|---|---|
| `grep` | filter lines by pattern |
| `sed` | find/replace, edit streams |
| `awk` | column-based processing |
| `cut`, `sort`, `uniq`, `wc` | slicing, sorting, counting |
| `jq`, `yq` | JSON / YAML |

```bash
grep -rn "ERROR" /var/log/app/            # recursive, with line numbers
grep -v "^#" config.conf | grep -v "^$"   # strip comments and blank lines
sed -i 's/replicas: 1/replicas: 3/' deploy.yaml
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head   # top client IPs
tail -f /var/log/syslog
kubectl get pods -o json | jq -r '.items[].metadata.name'
```

# Archives and transfer

```bash
tar czf backup.tar.gz /etc/app     # create (c), gzip (z), file (f)
tar xzf backup.tar.gz -C /tmp      # extract into /tmp
tar tzf backup.tar.gz              # list contents
scp file.txt user@host:/tmp/
rsync -avz --delete src/ user@host:/srv/dst/
sha256sum kubectl                  # verify a download
```

# SSH

```bash
ssh-keygen -t ed25519 -C "me@laptop"
ssh-copy-id user@host
ssh -i ~/.ssh/key -p 2222 user@host
ssh -L 8080:localhost:80 user@host      # local port forward
ssh -J bastion user@private-host        # jump host
```

`~/.ssh/config` saves typing:

```text
Host prod-bastion
    HostName 203.0.113.10
    User ubuntu
    IdentityFile ~/.ssh/prod

Host prod-*
    ProxyJump prod-bastion
```

# Packages

| Distro | Install | Search | Remove |
|---|---|---|---|
| Debian / Ubuntu | `apt install pkg` | `apt search pkg` | `apt purge pkg` |
| RHEL / Fedora | `dnf install pkg` | `dnf search pkg` | `dnf remove pkg` |
| Alpine | `apk add pkg` | `apk search pkg` | `apk del pkg` |

```bash
apt list --installed | wc -l
apt-mark hold kubelet kubeadm kubectl     # pin versions
```

# Kernel: modules and sysctl

```bash
lsmod | grep br_netfilter
sudo modprobe br_netfilter
sysctl net.ipv4.ip_forward
sudo sysctl -w net.ipv4.ip_forward=1    # runtime only
sudo sysctl --system                    # reload all /etc/sysctl.d/*.conf
uname -r                                # kernel version
```

See [CKS - System Hardening](./cks/system-hardening.md) for the security side of these settings.
