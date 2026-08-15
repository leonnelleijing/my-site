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

#### Falco Rule Snippets:

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

- rule: Sensitive File Read
  desc: Alerts when a sensitive file (e.g., shadow, hosts) is read
  condition: >
    (open_read and fd.name contains "/etc/shadow") or
    (open_read and fd.name contains "/etc/hosts") or
    (open_read and fd.name contains "/etc/kubernetes/admin.conf")
  output: "Sensitive file %fd.name read by %proc.name (user=%user.name container_id=%container.id)"
  priority: HIGH

- rule: Unexpected Outbound Connection
  desc: Alerts on any outbound network connection from a container that is not expected
  condition: >
    evt.type = connect and evt.dir = > and fd.cip != "0.0.0.0" and fd.sip != "0.0.0.0" and
    container.id != host and
    not fd.port in (80, 443, 53) # Exclude common HTTP/S and DNS
  output: "Unexpected outbound connection from container %container.name (%container.image) to %fd.cip:%fd.cport (user=%user.name)"
  priority: MEDIUM

- rule: Launch Privileged Container
  desc: Detects when a privileged container is launched
  condition: >
    spawn_process and container.privileged=true and container.id != host
  output: "Privileged container launched (name=%container.name image=%container.image cmd=%proc.cmdline user=%user.name)"
  priority: CRITICAL
```

#### Validate Falco config (dry-run):

```bash
sudo falco -c /etc/falco/falco.yaml --dry-run
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

### Istio PeerAuthentication

The `PeerAuthentication` resource in Istio is used to configure mutual TLS (mTLS) settings for communication between workloads in the service mesh. It allows you to enforce encrypted and authenticated communication, which is a critical security practice.

`PeerAuthentication` policies can be applied at different scopes:
-   **Mesh-wide**: Applied to all workloads in the mesh (in the root `istio-system` namespace).
-   **Namespace-wide**: Applied to all workloads in a specific namespace.
-   **Workload-specific**: Applied to a specific workload within a namespace.

#### mTLS Modes

The `PeerAuthentication` resource has three mTLS modes:
-   `STRICT`: Only mTLS encrypted traffic is accepted.
-   `PERMISSIVE`: Both mTLS and plaintext traffic are accepted. This is the default mode and is useful when migrating services to the mesh, as it allows communication from both Istio-enabled and non-Istio-enabled services.
-   `DISABLE`: mTLS is disabled. Plaintext traffic is used.

#### Example: Enforcing STRICT mTLS for a Namespace

To enforce `STRICT` mTLS for all workloads in the `default` namespace, you would apply the following policy:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default-strict-mtls
  namespace: default
spec:
  mtls:
    mode: STRICT
```

With this policy in place, any unencrypted traffic sent to a service in the `default` namespace will be rejected.

#### Example: Overriding mTLS for a Specific Workload

You can override the namespace-wide policy for a specific workload using a `selector`. For example, to disable mTLS for the `my-legacy-app` workload in the `default` namespace, you would apply the following policy:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: my-legacy-app-disable-mtls
  namespace: default
spec:
  selector:
    matchLabels:
      app: my-legacy-app
  mtls:
    mode: DISABLE
```

This workload-specific policy takes precedence over the namespace-wide policy for any pods with the label `app: my-legacy-app`.
