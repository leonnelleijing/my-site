---
slug: helm-kubernetes-package-manager
title: Helm - Kubernetes Package Manager
tags: [devOps, cloudNative]
---

# Helm - Kubernetes Package Manager

Helm is the package manager for Kubernetes, making it easier to define, install, and upgrade even complex applications.

## What is Helm?

Helm helps you manage Kubernetes applications by defining, installing, and upgrading them through reusable packages called **Charts**.

### Key Concepts

- **Chart**: A collection of files that describe a set of Kubernetes resources
- **Release**: An instance of a chart running in a Kubernetes cluster
- **Repository**: A collection of published charts

## Installation

```bash
# macOS with Homebrew
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version
```

## Creating a Helm Chart

```bash
# Create a new chart
helm create my-app

# Chart structure
my-app/
├── Chart.yaml           # Chart metadata
├── values.yaml          # Default configuration values
├── charts/              # Dependencies
├── templates/           # Kubernetes templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl
└── README.md
```

## Chart.yaml Example

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
type: application
version: 0.1.0
appVersion: "1.0"
author: Your Name
```

## values.yaml Example

```yaml
replicaCount: 2

image:
  repository: my-app
  tag: "1.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080

ingress:
  enabled: true
  hosts:
    - host: my-app.example.com
      paths:
        - path: /

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

## Template Example - deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    metadata:
      labels:
        {{- include "my-app.labels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 8080
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

## Common Helm Commands

### Install and Manage Releases

```bash
# Install a chart
helm install my-release my-app

# Install with custom values
helm install my-release my-app -f custom-values.yaml

# Install from repository
helm install my-release stable/mysql

# List releases
helm list

# Get release status
helm status my-release

# Get release values
helm get values my-release

# Upgrade a release
helm upgrade my-release my-app

# Rollback to previous release
helm rollback my-release 1

# Uninstall a release
helm uninstall my-release
```

### Repository Operations

```bash
# Add a repository
helm repo add stable https://charts.helm.sh/stable

# Update repositories
helm repo update

# Search for charts
helm search repo mysql

# List repositories
helm repo list

# Remove a repository
helm repo remove stable
```

### Chart Development

```bash
# Validate chart
helm lint my-app

# Template rendering (dry-run)
helm template my-release my-app

# Install with dry-run
helm install my-release my-app --dry-run --debug

# Package chart
helm package my-app

# Publish to repository
helm repo index .
```

## Best Practices

1. **Use Values Correctly**: Keep sensitive data in `values.yaml` and use Secrets for passwords
2. **Version Your Charts**: Always increment `Chart.yaml` version
3. **Document Your Charts**: Include comprehensive README files
4. **Test Templates**: Use `helm template` and `helm lint` before deployment
5. **Use Namespaces**: Deploy releases to separate namespaces for isolation
6. **Resource Limits**: Always define resource requests and limits
7. **Keep Dependencies Updated**: Regularly update chart dependencies

## Example: Installing MySQL

```bash
# Add Bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Install MySQL
helm install my-mysql bitnami/mysql \
  --set auth.rootPassword=secret \
  --set primary.persistence.enabled=true \
  --set primary.persistence.size=10Gi

# Check status
helm status my-mysql
```

## Troubleshooting

```bash
# Check logs of a release
helm get all my-release

# Get detailed event information
kubectl describe deployment -l app=my-app

# View Helm release history
helm history my-release

# Debug template rendering
helm template my-release my-app --debug
```

## Conclusion

Helm simplifies Kubernetes deployments by providing a templating and package management system. With Helm, you can manage complex applications, share configurations, and maintain consistency across environments.
