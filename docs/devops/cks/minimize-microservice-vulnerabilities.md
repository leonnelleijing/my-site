---
id: minimize-microservice-vulnerabilities
title: CKS - Minimize Microservice Vulnerabilities
sidebar_label: Minimize Microservice Vulnerabilities
---

## Minimize Microservice Vulnerabilities

This section covers how to minimize vulnerabilities in microservices running on Kubernetes.

### Pod Security Admission (PSA)

Pod Security Admission is a built-in admission controller that enforces the Pod Security Standards. The standards define three levels of security:
-   **privileged**: Unrestricted, the default level.
-   **baseline**: A set of basic security best practices.
-   **restricted**: The most restrictive level, which follows current pod hardening best practices.

You can enforce PSA at the namespace level by adding a label to the namespace.
```bash
kubectl label namespace my-namespace pod-security.kubernetes.io/enforce=restricted
```

### Pod Security Policies (PSP) - Deprecated

Pod Security Policies (PSPs) are a deprecated feature that was used to enforce security policies on pods. They are replaced by Pod Security Admission (PSA).

### Pod Security

Pod security fields to enforce:

-   `securityContext` for pods/containers (`runAsUser`, `runAsGroup`, `readOnlyRootFilesystem`).
-   Avoid `privileged: true`. Minimize capabilities with `capabilities.drop`.
-   Use AppArmor/SELinux and seccomp profiles.
-   Use Pod Security Admission (PSA) or PodSecurityPolicy (deprecated) profiles to enforce policies cluster-wide.

#### Example securityContext:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  readOnlyRootFilesystem: true
  capabilities:
    drop: ["ALL"]
  allowPrivilegeEscalation: false
```
- **allowPrivilegeEscalation**: is always true when the container is run as privileged, or has `CAP_SYS_ADMIN`.

#### Pod Security Context fields

-   `runAsUser` and `runAsGroup`: Specify the user and group ID to run the container as.
-   `supplementalGroups`: A list of groups to add to the container process.
-   `readOnlyRootFilesystem`: Mounts the container's root filesystem as read-only.
-   `seccompProfile`: Seccomp profile to use for the container.
-   `apparmorProfile`: AppArmor profile to use for the container.
-   `capabilities`: Fine-grained control over the capabilities of the container.

#### Capabilities
Check capabilities of a container:
```bash
capsh --print
```

### Seccomp

Seccomp (secure computing mode) is a Linux kernel feature that can be used to restrict the system calls that a container can make.

#### Seccomp Profile

A seccomp profile is a JSON file that specifies which system calls are allowed and which are denied.

**Example Seccomp Profile:**
```json
{
    "defaultAction": "SCMP_ACT_ERRNO",
    "architectures": [
        "SCMP_ARCH_X86_64",
        "SCMP_ARCH_X86",
        "SCMP_ARCH_AARCH64"
    ],
    "syscalls": [
        {
            "names": [
                "accept",
                "arch_prctl",
                "brk"
            ],
            "action": "SCMP_ACT_ALLOW"
        }
    ]
}
```

To apply a seccomp profile to a pod, you can use the `seccompProfile` field in the `securityContext`.

```yaml
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: profiles/my-seccomp-profile.json
```

### AppArmor

AppArmor is a Linux security module that can be used to confine programs to a limited set of resources.

#### AppArmor Profile

An AppArmor profile is a text file that specifies which files a program can read, write, and execute.

**Example AppArmor Profile:**
```
#include <tunables/global>

profile my-apparmor-profile flags=(attach_disconnected) {
  #include <abstractions/base>

  file,
  
  # Deny all file writes.
  deny /** w,
}
```

To load an AppArmor profile, you can use the `apparmor_parser` command.
```bash
sudo apparmor_parser -r -W my-apparmor-profile
```

To apply an AppArmor profile to a pod, you can use the `apparmor.security.beta.kubernetes.io/pod` annotation.
```yaml
metadata:
  annotations:
    container.apparmor.security.beta.kubernetes.io/my-container: localhost/my-apparmor-profile
```

### Network Security

#### Ingress TLS

Create a TLS secret from a certificate and key:

```bash
kubectl create secret tls my-tls -n my-namespace --cert=./tls.crt --key=./tls.key
```

Reference the secret in your Ingress resource.

#### NetworkPolicy

NetworkPolicies restrict pod-to-pod and pod-to-external traffic. Ensure your CNI plugin (e.g., Calico, Cilium) implements network policies.

-   `ingress`: Incoming connections
-   `egress`: Outgoing connections

##### Example NetworkPolicy

This example allows specific ingress and egress traffic for pods with the `env: production` label.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: demo-network-policy
spec:
  podSelector:
    matchLabels:
      env: production
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - podSelector:
            matchLabels:
              env: security
        - namespaceSelector:
            matchLabels:
              project: myproject
  egress:
    - to:
        - ipBlock:
            cidr: 8.8.8.8/32
      ports:
        - protocol: TCP
          port: 5978
```

### mTLS (Mutual TLS)

Mutual TLS (mTLS) is a method for mutual authentication in which both parties in a network connection authenticate each other using TLS certificates. This is in contrast to traditional TLS, where only the server authenticates itself to the client.

mTLS is a crucial component of a zero-trust network model and is essential for securing communication between microservices.

Service meshes like Istio and Linkerd can be used to automatically implement mTLS for all traffic between your microservices.
