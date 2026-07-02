# Kubernetes Lab Series

> **Build Kubernetes from the ground up.** No managed cloud services, no shortcuts—just a production-style, highly available Kubernetes cluster built and operated from scratch.

This repository documents my journey of learning and implementing Kubernetes by building an **on-premises Kubernetes cluster** using **kubeadm** and gradually introducing production-ready concepts through hands-on labs.

Each branch represents a **standalone lab**, focusing on a specific Kubernetes concept while building on knowledge from the previous labs.

---

# Current Infrastructure

The lab environment currently consists of **five virtual machines**.

| Machine    | Role                     |
| ---------- | ------------------------ |
| `lb-1`     | Load Balancer            |
| `master-1` | Kubernetes Control Plane |
| `master-2` | Kubernetes Control Plane |
| `worker-1` | Worker Node              |
| `worker-2` | Worker Node              |

The cluster is configured as a **Highly Available Kubernetes Cluster** using **kubeadm**.

---

# Technology Stack

* Kubernetes (kubeadm)
* containerd (CRI)
* runc (OCI Runtime)
* Calico (CNI)
* MetalLB
* NGINX Ingress Controller
* nerdctl
* BuildKit
* Docker Hub
* kubectl
* SSH

---

# Cluster Highlights

* High Availability Control Plane
* Multiple Worker Nodes
* containerd as the Container Runtime
* Calico for Pod Networking
* MetalLB for External LoadBalancer Services
* NGINX Ingress Controller
* Docker Hub as the Container Registry
* nerdctl + BuildKit for container image management
* Fully self-managed on-premises environment

---

# Lab Roadmap

## 🚀 Lab 01 — Building a Kubernetes Cluster & Deploying Your First Application

**Branch**

`k8s-lab-1-simple-deployment`

Learn how to build a Kubernetes cluster from scratch using **kubeadm**, configure **containerd** as the Container Runtime, install **Calico**, deploy a simple NestJS application, and expose it using an NGINX Ingress Controller.

**Repository**

https://github.com/EngrMuqeetAhmad/k8s-lab/tree/k8s-lab-1-simple-deployment

---

## 🧪 Lab 02 (Optional) — MetalLB on an On-Premises Cluster

**Branch**

`experimental-VMs-metalLB-lab`

Cloud providers automatically provision external load balancers—but what if you're running Kubernetes on your own infrastructure?

In this optional lab, configure **MetalLB** to provide external IP addresses for `LoadBalancer` Services, bringing cloud-like networking capabilities to an on-premises Kubernetes cluster.

**Repository**

https://github.com/EngrMuqeetAhmad/k8s-lab/tree/experimental-VMs-metalLB-lab

---

## 🔐 Lab 03 — ConfigMaps & Secrets

**Branch**

`k8s-lab-3-configMap-secrets`

Separate configuration from your application code by using **ConfigMaps** and **Secrets**. Learn how to inject environment variables into Pods and manage application settings and sensitive credentials without rebuilding container images.

**Repository**

https://github.com/EngrMuqeetAhmad/k8s-lab/tree/k8s-lab-3-configMap-secrets

---

## 🎯 Lab 04 — Kustomize

**Branch**

`k8s-lab-4-kustomize`

Manage **development** and **production** environments without the headache of copying and maintaining multiple YAML files.

Learn how to use **Base** and **Overlay** configurations, generate ConfigMaps and Secrets from environment files, patch existing resources, and deploy multiple environments from a single source of truth.

**Repository**

https://github.com/EngrMuqeetAhmad/k8s-lab/tree/k8s-lab-4-kustomize

