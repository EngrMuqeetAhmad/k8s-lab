# Kubernetes Lab 04 — Kustomize: Managing Multiple Environments

In the previous lab, we created **ConfigMaps** and **Secrets** manually using YAML manifests.

While this works well for a single environment, real-world applications are deployed to multiple environments such as **Development**, **Staging**, and **Production**, each requiring different configuration values.

In this lab, we'll use **Kustomize**, the native Kubernetes configuration management tool, to manage environment-specific deployments without duplicating YAML files.

---

# Learning Objectives

After completing this lab, you will understand:

* What Kustomize is
* Why Kustomize is useful
* Base vs Overlay architecture
* Environment-specific deployments
* ConfigMap and Secret generators
* Resource patching
* Name prefixes
* Namespace customization
* Deploying multiple environments from the same manifests

---

You should already have:

* A running Kubernetes cluster
* kubectl configured
* NGINX Ingress Controller
* Calico CNI

---

# What is Kustomize?

Kustomize is Kubernetes' built-in configuration customization tool.

Instead of maintaining multiple copies of the same YAML files for different environments, Kustomize allows you to:

* Keep one common base
* Apply environment-specific customizations
* Generate ConfigMaps
* Generate Secrets
* Patch existing resources
* Deploy without modifying the original manifests

Kustomize is integrated directly into `kubectl`, so no additional installation is required.

---

# Project Structure

```text
k8s/
├── base
│   ├── deployment.yaml
│   ├── ingress.yaml
│   ├── kustomization.yaml
│   ├── metallb-config.yaml
│   ├── namespace.yaml
│   └── service.yaml
│
└── overlays
    ├── dev
    │   ├── config.env
    │   ├── secret.env
    │   ├── ingress-patch.yaml
    │   └── kustomization.yaml
    │
    └── prod
        ├── config.env
        ├── secret.env
        ├── ingress-patch.yaml
        └── kustomization.yaml
```

The repository is divided into:

* **base/** → Shared Kubernetes manifests
* **overlays/dev/** → Development configuration
* **overlays/prod/** → Production configuration

---

# Base Manifests

The **base** directory contains reusable Kubernetes resources.

These resources are environment-independent.

Examples include:

* Namespace
* Deployment
* Service
* Ingress


The base manifests do **not** contain environment-specific values such as:

* Hostnames
* Database credentials
* Environment variables

---

# Development Overlay

The Development overlay customizes the base resources.

Example:

```yaml
namespace: backend-dev

resources:
- ../../base

configMapGenerator:
- name: backend-config
  envs:
  - config.env

secretGenerator:
- name: backend-secret
  envs:
  - secret.env

generatorOptions:
  disableNameSuffixHash: true

namePrefix: dev-

patches:
- path: ingress-patch.yaml
```

This overlay:

* Deploys into the `backend-dev` namespace
* Creates a ConfigMap from `config.env`
* Creates a Secret from `secret.env`
* Adds the prefix `dev-` to resources
* Patches the Ingress hostname

---

# Production Overlay

The Production overlay follows the same structure.

```yaml
namespace: backend-prod

resources:
- ../../base

configMapGenerator:
- name: backend-config
  envs:
  - config.env

secretGenerator:
- name: backend-secret
  envs:
  - secret.env

generatorOptions:
  disableNameSuffixHash: true

replicas:
- name: nestjs-api
  count: 1

patches:
- path: ingress-patch.yaml
```

This overlay:

* Deploys into the `backend-prod` namespace
* Generates production ConfigMaps
* Generates production Secrets
* Uses production-specific Ingress configuration
* Overrides the replica count

---

# Environment Files

Instead of defining ConfigMaps and Secrets as YAML, Kustomize generates them directly from environment files.

## config.env

Example:

```text
PORT=3000
ENVIRONMENT=development
```

## secret.env

Example:

```text
DB_USER=postgres
DB_PASSWORD=123
```

Kustomize converts these files into Kubernetes ConfigMaps and Secrets during deployment.

---

# Patching the Ingress

The base Ingress manifest contains a placeholder hostname.

```yaml
host: placeholder
```

Each overlay replaces this value using an Ingress patch.

Development:

```yaml
host: dev.example.local
```

Production:

```yaml
host: api.example.com
```

This allows the same base manifest to be reused across environments.

---

# Deploy the Development Environment

Navigate to the Kubernetes directory.

```bash
cd k8s
```

Deploy the development overlay.

```bash
kubectl apply -k overlays/dev
```

---

# Deploy the Production Environment

Deploy the production overlay.

```bash
kubectl apply -k overlays/prod
```

---

# Verify the Deployment

View namespaces.

```bash
kubectl get ns
```

View deployments.

```bash
kubectl get deployments -A
```

View services.

```bash
kubectl get svc -A
```

View ConfigMaps.

```bash
kubectl get configmaps -A
```

View Secrets.

```bash
kubectl get secrets -A
```

View Ingress resources.

```bash
kubectl get ingress -A
```

---

# Preview Generated Resources

Before applying manifests, you can inspect the generated YAML.

Development:

```bash
kubectl kustomize overlays/dev
```

Production:

```bash
kubectl kustomize overlays/prod
```

This is useful for verifying patches and generated resources before deployment.

---

# Why Kustomize?

Without Kustomize:

* Duplicate YAML files
* Difficult maintenance
* Configuration drift
* Manual edits for every environment

With Kustomize:

* Single source of truth
* Environment-specific customization
* No duplicated manifests
* Easier maintenance
* Native Kubernetes support
* Better Git workflows

---

# Cleanup

Remove the development environment.

```bash
kubectl delete -k overlays/dev
```

Remove the production environment.

```bash
kubectl delete -k overlays/prod
```

---

# What You Learned

In this lab, you learned how to:

* Organize Kubernetes manifests using Base and Overlays
* Generate ConfigMaps from environment files
* Generate Secrets from environment files
* Patch existing Kubernetes resources
* Customize namespaces
* Apply resource name prefixes
* Deploy multiple environments from a single codebase
* Use Kustomize with `kubectl`

---

References

* Kubernetes Documentation – Kustomize
* Kubernetes Documentation – Declarative Configuration Management
* Kubernetes Documentation – ConfigMaps
* Kubernetes Documentation – Secrets
