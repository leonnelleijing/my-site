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

### Pod Security Context (for Volumes)

The `securityContext` in a Pod or Container definition allows you to control the security parameters of a Pod, including how volumes are mounted and accessed.

**`fsGroup`**: Defines the group ID that owns the mounted volumes and any files created within them. This is especially useful for `emptyDir` or persistent volumes.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  securityContext:
    fsGroup: 1000 # All volumes mounted will be owned by group ID 1000
  containers:
  - name: mycontainer
    image: myimage
    volumeMounts:
    - name: myvolume
      mountPath: /data
  volumes:
  - name: myvolume
    emptyDir: {}
```

**Restricting Volume Types**:
You can use `PodSecurityAdmission` or a third-party admission controller (like OPA Gatekeeper or Kyverno) to restrict the types of volumes that pods can use. For example, preventing the use of `hostPath` volumes is a common hardening step to prevent pods from accessing the host filesystem directly.

### Service Account Token Hardening

Service account tokens are sensitive credentials that grant pods permissions within the Kubernetes API. Hardening their usage is crucial.

**Limit Service Account Permissions**:
Always follow the principle of least privilege. Grant service accounts only the minimum necessary RBAC permissions required for their associated pods to function.

**Disable Automatic Mounting of API Credentials**:
By default, Kubernetes automatically mounts a service account token into every pod at `/var/run/secrets/kubernetes.io/serviceaccount`. If a pod does not need to communicate with the Kubernetes API, you should disable this behavior.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-no-api-access
spec:
  automountServiceAccountToken: false # Disable token automount for this pod
  containers:
  - name: mycontainer
    image: myimage
```

You can also disable `automountServiceAccountToken` at the ServiceAccount level:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: restricted-sa
automountServiceAccountToken: false # Disable token automount for all pods using this SA
```

**Interaction with Projected Volumes**:
While `automountServiceAccountToken: false` prevents the default service account token from being mounted, it does *not* prevent a token from being explicitly included as a source in a `projected` volume. If you use a `projected` volume, ensure that you only include the necessary sources and *do not* include a `serviceAccountToken` source if the pod does not require API access.

Example of a projected volume explicitly *excluding* a service account token:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-projected-no-sa-token
spec:
  serviceAccountName: my-service-account # Use a service account, but don't automount its token
  automountServiceAccountToken: false
  containers:
  - name: mycontainer
    image: myimage
    volumeMounts:
    - name: projected-secrets
      mountPath: /projected/secrets
      readOnly: true
  volumes:
  - name: projected-secrets
    projected:
      sources:
      - secret:
          name: my-secret
      - configMap:
          name: my-configmap
      # Do NOT include a serviceAccountToken source here if API access is not needed:
      #- serviceAccountToken:
      #    path: token
      #    expirationSeconds: 3607
      #    audience: my-audience
```

This ensures that even when using advanced volume features like projected volumes, you maintain strict control over service account token exposure.

**Use Bound Service Account Tokens**:
Kubernetes v1.20+ introduced bound service account tokens, which have a limited lifetime and audience. This reduces the risk if a token is compromised. Ensure your cluster is configured to use these. You define the expiration time and audience when requesting a token.

**Reviewing Service Account Usage**:
Regularly audit which pods use which service accounts and what permissions those service accounts have. Tools like Kube-Hunter or Kube-Bench can help identify misconfigurations.

## CIS Benchmark for Kubernetes

The Center for Internet Security (CIS) has published a benchmark for Kubernetes that provides a set of security best practices for configuring Kubernetes. The benchmark covers a wide range of topics, including:
-   API server hardening
-   Kubelet hardening
-   etcd hardening
-   Pod security
-   Network security

You can use the `kube-bench` tool to check your cluster against the CIS Kubernetes Benchmark.
[https://github.com/aquasecurity/kube-bench](https://github.com/aquasecurity/kube-bench)
