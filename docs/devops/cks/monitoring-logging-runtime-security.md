---
id: monitoring-logging-runtime-security
title: CKS - Monitoring, Logging and Runtime Security
sidebar_label: Monitoring, Logging & Runtime Security
---

## Monitoring, Logging and Runtime Security

This section covers how to monitor, log, and secure the runtime environment of your Kubernetes cluster.

### Immutable Infrastructure

The concept of immutable infrastructure is central to Kubernetes security. Instead of modifying running containers, you should build a new image and redeploy it. This approach has several security benefits:
-   **Reduces configuration drift**: Ensures that all running containers are identical to the image they were created from.
-   **Simplifies rollbacks**: If a vulnerability is discovered, you can simply roll back to a previous, known-good image.
-   **Makes it harder for attackers to persist**: If an attacker gains access to a container, any changes they make will be lost when the container is redeployed.

### Behavioral Analysis

Behavioral analysis involves monitoring the runtime behavior of your containers and detecting anomalies. This is a crucial layer of defense for detecting zero-day vulnerabilities and other unknown threats.

### Falco

Falco is a CNCF project that provides runtime security for Kubernetes. It can detect and alert on a wide range of suspicious activities, such as:
-   A shell is run inside a container.
-   A container is running in privileged mode.
-   A sensitive file is read.
-   A container makes an outbound network connection to a suspicious IP address.

Falco works by using a kernel module or an eBPF probe to capture system calls. These system calls are then analyzed by the Falco engine, which compares them against a set of rules.

#### Falco Rule Snippet:

```yaml
- list: administrative_shells
  items: [bash, zsh, sh, ksh]

- macro: inbound_network_event
  condition: syscall.type = accept and fd.typechar = 4

- rule: Shell Executed from Network Connection
  desc: Alerts if an inbound network event spawns a sensitive shell terminal
  condition: inbound_network_event and proc.name in (administrative_shells)
  output: "Alert: %proc.name spawned on port %fd.cport (user=%user.name)"
  priority: CRITICAL
```

#### Validate Falco config (dry-run):

```bash
sudo falco -C /etc/falco/falco.yaml --dry-run
```

#### Falco Outputs

Falco can be configured to send alerts to a variety of outputs, including:
-   STDOUT
-   A file
-   Syslog
-   A webhook
-   NATS

### Auditing

Kubernetes audit logs provide a chronological record of all the requests made to the Kubernetes API server. These logs are a valuable source of information for security analysis and incident response.

#### Audit Policy

The level of detail in the audit logs is determined by an audit policy file. The audit policy file is a YAML file that specifies which requests should be logged and at what level.

There are four audit levels:
-   **None**: Don't log events that match this rule.
-   **Metadata**: Log request metadata (requesting user, timestamp, resource, verb, etc.) but not the request or response body.
-   **Request**: Log event metadata and request body but not response body.
-   **RequestResponse**: Log event metadata, request body, and response body.

**Example Audit Policy:**
```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log pod changes at the RequestResponse level
  - level: RequestResponse
    resources:
    - group: ""
      resources: ["pods"]
  # Log "get" requests for secrets at the Metadata level
  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets"]
    verbs: ["get"]
  # A catch-all rule to log all other requests at the Metadata level
  - level: Metadata
    omitStages:
      - "RequestReceived"
```

To enable auditing, you need to pass the `--audit-policy-file` and `--audit-log-path` flags to the `kube-apiserver`.

#### Analyzing Audit Logs

Audit logs can be voluminous, so it's important to have tools to help you analyze them. Some popular tools include:
-   **Fluentd**: An open source data collector that can be used to forward audit logs to a variety of destinations.
-   **Elasticsearch**: A distributed search and analytics engine that can be used to store and analyze audit logs.
-   **Kibana**: A data visualization dashboard for Elasticsearch.
-   **Falco**: Falco can also be used to analyze audit logs and detect suspicious activity.

### Other Runtime Security Tools
- **Cilium**: Provides L4 encryption.
- **Istio**: Provides L7 encryption.
- **gVisor**: A user-space kernel for containers. It provides a hardened sandbox environment that can protect the host kernel from container escapes.
- **Kata Containers**: An open source project that uses lightweight virtual machines to provide a secure container runtime.

#### Inject Istio sidecar
```bash
kubectl label namespace default istio-injection=enabled --overwrite
```
