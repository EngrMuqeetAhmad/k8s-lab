# Kubernetes Lab - Lab 01

### Building a Basic Kubernetes Cluster with kubeadm

This repository contains the first lab of the **Kubernetes Lab Series**.

The purpose of this lab is to build a **production-style Kubernetes cluster from scratch** using **kubeadm**, deploy a simple **NestJS** application, and expose it over a Local Area Network (LAN) using **NGINX Ingress Controller**.

Unlike lightweight Kubernetes distributions such as Minikube or k3s, this lab focuses on understanding the individual components that make up a Kubernetes cluster.

---

# Architecture

```
                Client (Browser)
                       |
                       |
                 LAN Network
                       |
                +----------------+
                | Master Node    |
                |----------------|
                | kube-apiserver |
                | etcd           |
                | scheduler      |
                | controller     |
                | kubelet        |
                | containerd     |
                | nginx ingress  |
                +----------------+
                       |
          ------------------------------
          |                            |
          |                            |
 +-------------------+       +-------------------+
 | Worker Node       |       | Worker Node       |
 |-------------------|       |-------------------|
 | kubelet           |       | kubelet           |
 | containerd        |       | containerd        |
 | Calico            |       | Calico            |
 +-------------------+       +-------------------+

```

Pods communicate through the **Calico CNI**, while external traffic enters through the **NGINX Ingress Controller**, which routes requests to ClusterIP services.

---

# Objectives

In this lab you will learn how to:

* Install and configure containerd
* Install runc
* Install nerdctl
* Install BuildKit
* Configure containerd as the Kubernetes CRI
* Install kubeadm, kubelet, and kubectl
* Bootstrap a Kubernetes cluster
* Join worker nodes
* Install Calico CNI
* Remove the default control-plane taint (for small labs)
* Build and run a NestJS application
* Deploy the application to Kubernetes
* Expose the application through a ClusterIP Service
* Access the application using NGINX Ingress over LAN

---

# Technologies Used

| Component                | Purpose                              |
| ------------------------ | ------------------------------------ |
| Kubernetes               | Container orchestration              |
| kubeadm                  | Cluster bootstrap                    |
| kubelet                  | Node agent                           |
| kubectl                  | Kubernetes CLI                       |
| containerd               | Container Runtime (CRI)              |
| runc                     | OCI Runtime                          |
| nerdctl                  | Docker-compatible CLI for containerd |
| BuildKit                 | Image building                       |
| Calico                   | CNI Plugin                           |
| NGINX Ingress Controller | Ingress / Load Balancer              |
| SSH                      | Remote node management               |
| NestJS                   | Sample application                   |

---

# Cluster Configuration

* Kubernetes installed using **kubeadm**
* **containerd** as the Container Runtime
* **runc** as OCI runtime
* **Calico** networking
* **NGINX Ingress Controller**
* ClusterIP Services
* Access over Local Area Network
* Control Plane scheduling enabled (taint removed)

---

# Repository Structure

As it is a simple one application deploymentm, we are going to keep the structure simple.

```
k8s-lab/
  ├── Dockerfile
  ├── eslint.config.mjs
  ├── k8s
      │
      ├── namespace.yaml
      ├── deployment.yaml
      ├── service.yaml
      ├── ingress.yaml
  ├── nest-cli.json
  ├── node_modules
  ├── package.json
  ├── package-lock.json
  ├── README.md
  ├── src
  ├── test
  ├── tsconfig.build.json
  └── tsconfig.json
  └── README.md
```

---

# Prerequisites

At least 1 Linux machines. 2 is recommended
>> if you have only 1 machine, then step 8 is a must otherwise optional

Example:

| Machine | Role          |
| ------- | ------------- |
| Master  | Control Plane |
| Worker  | Worker Node   |

Requirements

* Ubuntu 22.04+ (recommended)
* Static IPs
* SSH access
* Internet connection
* Swap disabled
* Required kernel modules enabled

---

# Step 1 — Install containerd

Install containerd following the official guide.

Official Documentation

https://github.com/containerd/containerd/blob/main/docs/getting-started.md

After installation, verify:

```bash
containerd --version
```

---

# Installing CNI plugins

Download the cni-plugins-<OS>-<ARCH>-<VERSION>.tgz archive from https://github.com/containernetworking/plugins/releases

extract it under /opt/cni/bin:
```
$ mkdir -p /opt/cni/bin
$ sudo tar Cxzvf /opt/cni/bin cni-plugins-<OS>-<ARCH>-<VERSION>.tgz
```

---


# Step 2 — Install runc

Install the OCI runtime.

Official Releases

https://github.com/opencontainers/runc/releases

Verify

```bash
runc --version
```

---

# Step 3 — Install nerdctl and BuildKit

Install the Docker-compatible CLI for containerd.

Documentation

https://github.com/containerd/nerdctl

Releases

https://github.com/containerd/nerdctl/releases

Verify

```bash
nerdctl --version
buildctl --version
```

---

# Step 4 — Configure containerd for Kubernetes
https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd

Generate the default configuration.

```bash
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo nano /etc/containerd/config.toml
```

Find
`SystemdCgroup` and make it true

After edit:
`SystemdCgroup = true`

Restart containerd.

```bash
sudo systemctl restart containerd
```

Configure the runtime according to the Kubernetes documentation.

---

# Step 5 — Install Kubernetes Components

Install

* kubeadm
* kubelet
* kubectl

Official Documentation

https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/

Verify

```bash
kubeadm version
kubectl version --client
kubelet --version
```

---

# Step 6 — Initialize the Cluster

Prepare the host according to the kubeadm documentation.

Official Guide

https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/

Initialize:

```bash
sudo kubeadm init
```

Configure kubectl:

```bash
mkdir -p $HOME/.kube

sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

---

# Step 7 — Install Calico CNI

Install the Pod Network.

Official Documentation

https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network

This project uses:

* Calico

Verify:

```bash
kubectl get pods -A
```

---

# Step 8 — Allow Pods on the Control Plane (Optional)

For a small development cluster, remove the default taint.

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Now workloads can also run on the master node.

> **Note:** This is recommended only for learning and development environments. In production, keep the control plane dedicated to cluster management.

---

# Step 9 — Join Worker Nodes

SSH into each worker node.

Run the join command generated during `kubeadm init`.

Example

```bash
sudo kubeadm join <master-ip>:6443 \
--token <token> \
--discovery-token-ca-cert-hash sha256:<hash>
```

Verify

```bash
kubectl get nodes
```

---

# Step 10 — Install NGINX Ingress Controller

Install the NGINX Ingress Controller.

Since this cluster runs on a local network without a cloud provider, the Ingress Controller is exposed using a **NodePort Service**.

Traffic Flow

```
Client
   |
NodePort
   |
NGINX Ingress
   |
ClusterIP Service
   |
Pods
```

---

# Step 11 — Build the NestJS Image

Build using nerdctl.

Example

```bash
nerdctl build -t nestapi:v1 .
```

Verify

```bash
nerdctl images
```

---

# Step 12 — Deploy the Application

Clone the repository.

```bash
git clone <repository-url>

cd k8s
```

Create the namespace.

```bash
kubectl apply -f namespace.yaml
```

Create the service.

```bash
kubectl apply -f service.yaml
```

Deploy the application.

```bash
kubectl apply -f deployment.yaml
```

Create the ingress.

```bash
kubectl apply -f ingress.yaml
```

---

# Verify the Deployment

Pods

```bash
kubectl get pods -A
```

Deployments

```bash
kubectl get deployments
```

Services

```bash
kubectl get svc
```

Ingress

```bash
kubectl get ingress
```

Nodes

```bash
kubectl get nodes
```

---

# Networking Flow

```
Browser
   |
   v
Node IP
   |
NodePort
   |
NGINX Ingress Controller
   |
ClusterIP Service
   |
Deployment
   |
Pods
```

---

# Useful Commands

View Pods

```bash
kubectl get pods
```

Describe Pod

```bash
kubectl describe pod <pod-name>
```

View Logs

```bash
kubectl logs <pod-name>
```

Restart Deployment

```bash
kubectl rollout restart deployment <deployment-name>
```

Delete Everything

```bash
kubectl delete -f .
```

---

# Learning Outcomes

After completing this lab, you should understand:

* Kubernetes architecture
* kubeadm cluster initialization
* Container Runtime Interface (CRI)
* OCI runtimes
* Pod networking
* Calico CNI
* Deployments
* Services
* Ingress
* ClusterIP networking
* NGINX Ingress
* Building container images with BuildKit and nerdctl
* Multi-node Kubernetes clusters


---

# References

* Kubernetes Documentation
* kubeadm Documentation
* containerd Documentation
* nerdctl Documentation
* BuildKit Documentation
* Calico Documentation
* NGINX Ingress Documentation

---

# License

This repository is intended for educational and learning purposes.

Feel free to fork, experiment, and build upon it.
