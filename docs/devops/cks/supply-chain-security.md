---
id: supply-chain-security
title: CKS - Supply Chain Security
sidebar_label: Supply Chain Security
---

## Supply Chain Security

Supply chain security in Kubernetes is about ensuring the integrity and security of the components that make up your application, from the base images to the final running containers.

### Image Security Best Practices

Securing your container images is the first step in securing your supply chain.

#### Use Minimal Base Images

Start with the smallest possible base image. This reduces the attack surface by minimizing the number of packages and libraries in your image.

-   **Distroless images**: These images contain only your application and its runtime dependencies. They do not contain package managers, shells, or other programs you would expect to find in a standard Linux distribution.
-   **Alpine images**: These are very small and have a minimal package set.

#### Multi-Stage Builds

Use multi-stage builds to separate the build environment from the runtime environment. This prevents build tools and intermediate artifacts from being included in the final image.

```dockerfile
# Build stage
FROM golang:1.19-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

# Final stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

#### Run as Non-Root User

Avoid running containers as the root user. Use the `USER` instruction in your Dockerfile to specify a non-root user.

```dockerfile
FROM alpine:latest
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY . .
CMD ["./myapp"]
```

#### Scan Images for Vulnerabilities

Integrate image scanning into your CI/CD pipeline to detect known vulnerabilities in your images. Tools like Trivy and Clair can be used to scan images and generate reports.

**Example with Trivy:**
```bash
trivy image my-image:latest
```

### Image Signing and Verification

Image signing is a crucial part of supply chain security. It allows you to verify the integrity and provenance of your container images.

-   **Notary**: A CNCF project that provides a server and a client for signing and verifying content.
-   **Cosign**: A tool from the sigstore project that makes signing and verifying container images simple and easy.

#### Signing and Verifying with Cosign

1.  **Generate a key pair**:
    ```bash
    cosign generate-key-pair
    ```
    This will create two files: `cosign.key` (private key) and `cosign.pub` (public key).

2.  **Sign an image**:
    ```bash
    cosign sign --key cosign.key my-image:latest
    ```
    This will create a signature and push it to the OCI registry where the image is stored.

3.  **Verify an image**:
    ```bash
    cosign verify --key cosign.pub my-image:latest
    ```
    This will check the signature of the image against the public key.

### Docker Daemon Access
Check who is in the `docker` group on hosts:

```bash
getent group docker
```
or
```bash
cat /etc/group | grep docker
```

Remove a user from the docker group:
```bash
gpasswd -d developer docker
```

### Protect the Docker Socket
Edit the docker socket and service files to restrict access.
```bash
vim /usr/lib/systemd/system/docker.socket
vim /usr/lib/systemd/system/docker.service
```

### Admission Controllers

Admission controllers are a powerful tool for enforcing security policies in your cluster. They can intercept requests to the Kubernetes API server and can validate or mutate the requests.

#### ImagePolicyWebhook

The `ImagePolicyWebhook` is a built-in admission controller that can be used to validate images against a remote webhook. When an image is about to be run, the API server sends a request to the webhook, which can then approve or deny the image.

#### OPA/Gatekeeper and Kyverno

-   **OPA/Gatekeeper**: Open Policy Agent (OPA) is a general-purpose policy engine. Gatekeeper is a Kubernetes-native policy engine that uses OPA. You can write policies in Rego to enforce a wide range of security policies, including restricting which registries images can be pulled from.
-   **Kyverno**: Kyverno is another policy engine designed for Kubernetes. It allows you to write policies as Kubernetes resources (YAML), which can be easier to manage than Rego.

#### Example: ValidatingAdmissionWebhook

Here is an example of a `ValidatingWebhookConfiguration` that sends admission requests to a service that validates that images are from a trusted registry.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: image-validation-webhook
webhooks:
- name: image-validation.example.com
  rules:
  - apiGroups:   [""]
    apiVersions: ["v1"]
    operations:  ["CREATE", "UPDATE"]
    resources:   ["pods"]
    scope:       "Namespaced"
  clientConfig:
    service:
      namespace: default
      name: image-validation-service
      path: "/validate"
    caBundle: "<ca-bundle>"
  admissionReviewVersions: ["v1"]
  sideEffects: None
```


### SBOM (Software Bill of Materials)

A Software Bill of Materials (SBOM) is a formal record containing the details and supply chain relationships of various components used in building software. An SBOM is useful for vulnerability management and license compliance.

#### Generating an SBOM with Trivy

You can use Trivy to generate an SBOM for a container image.

```bash
trivy image --format cyclonedx -o sbom.json my-image:latest
```

This command will generate an SBOM in CycloneDX format and save it as `sbom.json`.
