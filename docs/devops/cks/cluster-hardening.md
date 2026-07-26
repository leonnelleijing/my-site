---
id: cluster-hardening
title: CKS - Cluster Hardening
sidebar_label: Cluster Hardening
---

## API Server Hardening

The Kubernetes API server is the central point of control for the entire cluster. It is essential to harden the API server to protect against a variety of attacks.

### Important API Server Flags

| Flag                                       | Recommended Value                               | Description                                                                                                                                    |
| ------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `--anonymous-auth`                         | `false`                                         | Disables anonymous access to the API server.                                                                                                   |
| `--authorization-mode`                     | `Node,RBAC`                                     | Enables Node and RBAC authorization modes.                                                                                                     |
| `--basic-auth-file`                        | Not set                                         | Disables basic authentication.                                                                                                                 |
| `--etcd-cafile`                            | Set                                             | The CA file for etcd.                                                                                                                          |
| `--etcd-certfile`                          | Set                                             | The cert file for etcd.                                                                                                                        |
| `--etcd-keyfile`                           | Set                                             | The key file for etcd.                                                                                                                         |
| `--insecure-bind-address`                  | Not set                                         | Disables the insecure bind address.                                                                                                            |
| `--insecure-port`                          | `0`                                             | Disables the insecure port.                                                                                                                    |
| `--kubelet-client-certificate`             | Set                                             | The client certificate for the kubelet.                                                                                                        |
| `--kubelet-client-key`                     | Set                                             | The client key for the kubelet.                                                                                                                |
| `--service-account-lookup`                 | `true`                                          | Enables service account lookup.                                                                                                                |
| `--service-account-key-file`               | Set                                             | The key file for service accounts.                                                                                                             |
| `--tls-cert-file`                          | Set                                             | The TLS cert file for the API server.                                                                                                          |
| `--tls-private-key-file`                   | Set                                             | The TLS private key file for the API server.                                                                                                   |
| `--token-auth-file`                        | Not set                                         | Disables token authentication.                                                                                                                 |

### Authorization Mode - AlwaysAllow Warning
It is crucial to avoid setting `--authorization-mode` to `AlwaysAllow` on the API server. In this mode, if an attacker can discover a node's IP address and the Kubelet's insecure port (e.g., `10250`), they could potentially execute commands within pods on that node. For example, knowing the node IP `172.30.30.21`, a simple `curl -k https://172.30.30.21:10250/runningpods/` could expose information or allow further unauthorized access. Always use `Node,RBAC` or similar restrictive modes.

## Taints and tolerations

Add a taint to a node to restrict scheduling:

```bash
kubectl taint nodes node1 key=value:NoSchedule
```

The 3 taint effects are:
-   `NoSchedule`: No new pods will be scheduled on the node unless they have a matching toleration.
-   `PreferNoSchedule`: The scheduler will try to avoid placing a pod on the node but it's not guaranteed.
-   `NoExecute`: No new pods will be scheduled on the node, and existing pods on the node will be evicted if they do not tolerate the taint.

Remove a taint:

```bash
kubectl taint nodes node1 key=value:NoSchedule-
```

### Pod toleration example (in Pod spec):

```yaml
tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
```

## Kubelet Hardening

The kubelet is the primary node agent. Hardening the kubelet is critical for node security.

The kubelet configuration is stored in `/var/lib/kubelet/config.yaml`.

### Important Kubelet Settings

| Setting | Recommended Value | Description |
| --- | --- | --- |
| `authentication.anonymous.enabled` | `false` | Disables anonymous access to the kubelet. |
| `authentication.x509.clientCAFile` | Set | The CA file for client certificates. |
| `authorization.mode` | `Webhook` | Enables webhook authorization. |
| `readOnlyPort` | `0` | Disables the read-only port. |
| `protectKernelDefaults` | `true` | Protects kernel defaults. |

## etcd Hardening

etcd stores the state of the Kubernetes cluster. It is essential to harden etcd to protect against a variety of attacks.

-   **Use a separate etcd cluster**: Do not run etcd on the same nodes as the Kubernetes control plane.
-   **Enable client certificate authentication**: Use the `--client-cert-auth` flag to enable client certificate authentication.
-   **Use a firewall**: Use a firewall to restrict access to etcd to only the Kubernetes API server.
-   **Encrypt etcd data at rest**: Use the `--encryption-provider-config` flag to enable encryption at rest.

## Compare binary checksums
Compare runtime binaries with checksums to ensure they have not been tampered with.
```bash
sha512sum /path/to/binary
```
Or
```bash
shasum -a 256 /path/to/binary
```

## Kubernetes Component Configuration Files

-   **The Core Configuration Manifests (`/etc/kubernetes/manifests`)**: The main control plane components run as Static Pods. The kubelet actively watches this folder.
    -   `kube-apiserver.yaml`: The main API server configuration (ports, authentication, limits).
    -   `kube-controller-manager.yaml`: Config for the core background controllers.
    -   `kube-scheduler.yaml`: Config for pod scheduling algorithms.
    -   `etcd.yaml`: The database configuration (cluster state, storage paths, peer links).
-   **The Cluster Credentials & Kubeconfigs (`/etc/kubernetes/`)**: These files contain the highly sensitive TLS certificates, cluster endpoints, and private keys.
    -   `admin.conf`: The root configuration file for cluster administration.
    -   `kubelet.conf`: Used by the host's kubelet daemon to talk back to the master node.
    -   `controller-manager.conf` & `scheduler.conf`: Credentials dedicated to those internal services.
-   **The Crypto Keys (`/etc/kubernetes/pki/`)**: This subdirectory holds the raw authority certificates (`ca.crt`) and private keys (`ca.key`).
-   **System Services (Outside `/etc/kubernetes`)**
    -   **The Kubelet Config**: `/var/lib/kubelet/config.yaml`
    -   **The Container Runtime Config**: `/etc/containerd/config.toml` (for containerd).
    -   **The Kubelet Service**: `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`.

## Upgrade Kubernetes Cluster

Upgrade kubeadm, kubelet and kubectl:
```bash
apt install kubelet=1.30.1-1.1 kubeadm=1.30.1-1.1 kubectl=1.30.1-1.1
```

Upgrade the node:
```bash
kubeadm upgrade node
```

After update, restart kubelet:
```bash
systemctl daemon-reload
systemctl restart kubelet
```

## Projected volumes

Projected volumes map several existing volume sources into the same directory.

## CIS Benchmark for Kubernetes

The Center for Internet Security (CIS) has published a benchmark for Kubernetes that provides a set of security best practices for configuring Kubernetes. The benchmark covers a wide range of topics, including:
-   API server hardening
-   Kubelet hardening
-   etcd hardening
-   Pod security
-   Network security

You can use the `kube-bench` tool to check your cluster against the CIS Kubernetes Benchmark.
[https://github.com/aquasecurity/kube-bench](https://github.com/aquasecurity/kube-bench)
