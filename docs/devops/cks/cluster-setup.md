---
id: cluster-setup
title: CKS - Cluster Setup
sidebar_label: Cluster Setup
---

## Cluster Setup

This section covers the initial setup of a Kubernetes cluster with a focus on security.

### Securing the Underlying Infrastructure

The security of your Kubernetes cluster is only as strong as the security of the underlying infrastructure. It is essential to secure the infrastructure that your cluster runs on, whether it is in the cloud or on-premise.

-   **Cloud Provider**: If you are running your cluster in the cloud, you should follow the security best practices of your cloud provider.
-   **On-Premise**: If you are running your cluster on-premise, you should ensure that your servers are physically secure and that the operating system is hardened.

### Network Security

Network security is a critical part of Kubernetes security. You should use a CNI plugin that supports NetworkPolicies to restrict traffic between pods. For more information, see the [Network Security](./minimize-microservice-vulnerabilities.md#network-security) section.

### Cluster Architecture

- **Control plane components**: `kube-apiserver`, `etcd`, `kube-controller-manager`, `kube-scheduler`.
- **Worker node components**: `kubelet`, container runtime (containerd), `kube-proxy` (or CNI dataplane).
- **Config/manifests paths**:
  - Control plane static pods: `/etc/kubernetes/manifests/`
  - Kubelet config: `/var/lib/kubelet/config.yaml`
  - PKI: `/etc/kubernetes/pki/`
  - Kubeconfigs (credentials): `/etc/kubernetes/` (e.g., `admin.conf`, `kubelet.conf`)

### RBAC (Role-Based Access Control)

Roles are namespace-scoped; ClusterRoles are cluster-scoped. RoleBindings bind users/groups/serviceaccounts to Roles or ClusterRoles.

- **Role**: grants permissions within a specific namespace.
- **RoleBinding**: grants the permissions defined in a role to a user or set of users within a specific namespace.
- **ClusterRole**: grants the same permissions as a role, but cluster-wide.
- **ClusterRoleBinding**: grants the permissions defined in a ClusterRole to a user or set of users cluster-wide.

#### Examples

Create a Role in a namespace:

```bash
kubectl -n my-namespace create role secret-reader --verb=get,list --resource=secrets
```

Bind a user to that Role:

```bash
kubectl -n my-namespace create rolebinding secret-reader-binding --role=secret-reader --user=alice@example.com
```

#### Check permissions (simulate user)

```bash
kubectl auth can-i get secrets --as=alice@example.com -n my-namespace
```

### etcd (secure storage)

etcd stores cluster state; protect it with TLS and restrict network access.

- **Configuration file**: `/etc/kubernetes/manifests/etcd.yaml` (static pod manifest)
- Ensure etcd data directory has strict permissions and is not world-readable.
- Use TLS for encryption in transit.
- Enable encryption at rest.

#### Encryption at Rest

Etcd stores sensitive data, so it's important to encrypt it at rest. You can enable encryption at rest by creating an `EncryptionConfiguration` object.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <base64-encoded-secret>
    - identity: {}
```

You need to pass this file to the `kube-apiserver` using the `--encryption-provider-config` flag.

### API server: auth, audit and flags

The API server runs with many flags. Check the static pod manifest at `/etc/kubernetes/manifests/kube-apiserver.yaml`.

#### Important flags for security:

-   `--authorization-mode=RBAC`: Prefer RBAC over `AlwaysAllow`.
-   `--audit-policy-file=/path/to/audit-policy.yaml` and `--audit-log-path=/var/log/kubernetes/audit.log`: Enable and configure audit logging.
-   `--etcd-cafile`, `--etcd-certfile`, `--etcd-keyfile`: to secure etcd communication.
-   `--service-account-issuer` and key/cert flags for signing service account tokens.

### Authentication and Authorization

-   **Authentication**: The process of identifying a user. Kubernetes supports a variety of authentication methods, including:
    -   **Client certificates**: The most common authentication method for system components.
    -   **Bearer tokens**: A common authentication method for users and service accounts.
    -   **OpenID Connect (OIDC)**: A popular authentication method for integrating with third-party identity providers.
-   **Authorization**: The process of determining whether a user is allowed to perform a particular action. Kubernetes uses Role-Based Access Control (RBAC) for authorization.

### Secrets Management

Secrets are sensitive pieces of data, such as passwords, API keys, and certificates. Kubernetes provides a built-in `Secret` object for storing and managing secrets.

-   **Secrets are not encrypted by default**: Secrets are stored in etcd as base64-encoded plain text. It is essential to enable encryption at rest for secrets.
-   **External secret stores**: For enhanced security, you can use an external secret store, such as [HashiCorp Vault](https://www.vaultproject.io/) or [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/).
