# Kubernetes Lab 03 — ConfigMaps & Secrets

In this lab, you'll learn how to externalize application configuration using **ConfigMaps** and **Secrets**. Instead of hardcoding configuration values inside your application or container image, Kubernetes allows you to inject them at deployment time.

This lab builds upon the cluster created in the previous labs and updates the NestJS deployment to consume configuration from Kubernetes resources.

---

# Learning Objectives

After completing this lab, you will understand:

* What ConfigMaps are
* What Secrets are
* The difference between ConfigMaps and Secrets
* When to use each resource
* How to inject configuration into Pods
* How Kubernetes separates application code from configuration
* How to deploy applications using ConfigMaps and Secrets

---

# Prerequisites

Before starting this lab, complete:

* **Lab 01** – Kubernetes Cluster with kubeadm
* **Lab 02** – Deploying a NestJS Application

You should already have:

* A working Kubernetes cluster
* NGINX Ingress Controller
* Calico CNI
* kubectl configured
* A running NestJS application

---

# Checkout the Lab

```bash
git checkout k8s-lab-3-configMap-secrets
```

Navigate to the Kubernetes manifests.

```bash
cd k8s
```

Repository structure:

```text
k8s/
├── backend-config-map.yaml
├── backend-secret.yaml
├── deployment.yaml
├── service.yaml
├── ingress.yaml
├── namespace.yaml
└── metallb-config.yaml   # Optional
```

---

# Understanding ConfigMaps

A **ConfigMap** stores non-sensitive configuration that your application needs at runtime.

Examples include:

* Environment
* Port numbers
* Feature flags
* API URLs
* Application settings

In this lab, the ConfigMap contains:

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: backend-config
  namespace: backend

data:
  PORT: "3000"
  ENVIRONMENT: "development"
```

This allows the application to read:

* PORT
* ENVIRONMENT

without hardcoding these values inside the container image.

---

# Understanding Secrets

A **Secret** stores sensitive configuration.

Typical examples:

* Database credentials
* API keys
* OAuth tokens
* JWT secrets
* TLS certificates

In this lab we define:

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: backend-secret
  namespace: backend

type: Opaque

stringData:
  DB_USER: postgres
  DB_PASSWORD: "123"
```

The Secret provides:

* DB_USER
* DB_PASSWORD

to the application.

> **Note:** Secrets are Base64-encoded by Kubernetes. This is **not encryption**. For production workloads, consider enabling encryption at rest and integrating with an external secrets manager such as HashiCorp Vault or your cloud provider's secret management service.

---

# Updating the Deployment

The Deployment has been updated to use the new image:

```text
k8s:configmap-secret
```

It now loads configuration from both:

* ConfigMap
* Secret

at runtime.

This keeps the application image environment-agnostic and reusable across development, staging, and production.

---

# Deploy the Resources

Create the namespace.

```bash
kubectl apply -f namespace.yaml
```

Create the ConfigMap.

```bash
kubectl apply -f backend-config-map.yaml
```

Create the Secret.

```bash
kubectl apply -f backend-secret.yaml
```

Deploy the application.

```bash
kubectl apply -f deployment.yaml
```

Create the Service.

```bash
kubectl apply -f service.yaml
```

Create the Ingress.

```bash
kubectl apply -f ingress.yaml
```

> **Optional:** If you are using MetalLB in your lab environment, you can also apply:

```bash
kubectl apply -f metallb-config.yaml
```

---

# Verify the Resources

List ConfigMaps.

```bash
kubectl get configmaps
```

List Secrets.

```bash
kubectl get secrets
```

View the ConfigMap.

```bash
kubectl describe configmap backend-config
```

View the Secret metadata.

```bash
kubectl describe secret backend-secret
```

View Pods.

```bash
kubectl get pods
```

View Deployment.

```bash
kubectl get deployment
```

---

# Verify Environment Variables

Find your Pod.

```bash
kubectl get pods
```

Open a shell inside the container.

```bash
kubectl exec -it <pod-name> -- sh
```

Print the injected environment variables.

```bash
env | grep PORT
env | grep ENVIRONMENT
env | grep DB_USER
env | grep DB_PASSWORD
```

You should see the values coming from the ConfigMap and Secret.

---

# Why Use ConfigMaps and Secrets?

Without ConfigMaps and Secrets:

* Every environment requires rebuilding the container image.
* Configuration is tightly coupled with the application.
* Sensitive data may end up in source control.

With ConfigMaps and Secrets:

* One container image can be deployed everywhere.
* Configuration is managed independently.
* Sensitive values are isolated from application code.
* Deployments become more portable and maintainable.

---

# Cleanup

Remove all resources.

```bash
kubectl delete -f .
```

---

# What You Learned

In this lab you learned how to:

* Create ConfigMaps
* Create Secrets
* Separate configuration from application code
* Inject environment variables into Pods
* Deploy applications using external configuration
* Follow Kubernetes configuration best practices

---

References

* Kubernetes ConfigMaps Documentation
* Kubernetes Secrets Documentation
