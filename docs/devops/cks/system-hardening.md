---
id: system-hardening
title: CKS - System Hardening
sidebar_label: System Hardening
---

## System Hardening

System hardening is the process of securing a server by reducing its surface of vulnerability. This is a critical part of securing a Kubernetes cluster, as the security of the cluster depends on the security of the underlying nodes.

### Kernel Hardening

The Linux kernel is the core of the operating system, and it is essential to harden it to protect against a variety of attacks.

#### sysctl

`sysctl` is a tool for modifying kernel parameters at runtime. You can use it to configure a wide range of security-related kernel parameters.

To set a kernel parameter, you can use the `sysctl` command:
```bash
sudo sysctl -w kernel.pids_max=4194304
```

To make the changes persistent across reboots, you can add them to `/etc/sysctl.conf` or a file in `/etc/sysctl.d/`.

**Important Kernel Parameters for Security:**

-   `kernel.pids_max`: Sets the maximum number of PIDs in the system.
-   `net.ipv4.tcp_syncookies`: Helps to protect against SYN flood attacks.
-   `net.ipv4.ip_forward`: Disable if the node is not a router.
-   `vm.mmap_min_addr`: Sets the minimum memory address that a user can mmap.

### Reducing Attack Surface

-   **Minimize running services**: Only run the services that are absolutely necessary.
-   **Close open ports**: Use a firewall to block all incoming traffic except for the ports that are required for Kubernetes to function.

#### Host-based Firewall

You can use `ufw` (Uncomplicated Firewall) or `iptables` to configure a host-based firewall.

**Example with ufw:**
```bash
# Allow Kubernetes API server
sudo ufw allow 6443/tcp

# Allow etcd
sudo ufw allow 2379:2380/tcp

# Allow kubelet
sudo ufw allow 10250/tcp

# Enable ufw
sudo ufw enable
```

### Secure Boot

Secure Boot is a security standard developed by members of the PC industry to help make sure that a device boots using only software that is trusted by the Original Equipment Manufacturer (OEM). When the PC starts, the firmware checks the signature of each piece of boot software, including UEFI firmware drivers (also known as Option ROMs), EFI applications, and the operating system. If the signatures are valid, the PC boots, and the firmware gives control to the operating system.

### CIS Benchmarks for the OS

In addition to the CIS Kubernetes Benchmark, there are also CIS Benchmarks for a wide variety of operating systems, including Ubuntu, CentOS, and Windows Server. It is important to harden the underlying operating system of your Kubernetes nodes according to the relevant CIS Benchmark.

-   **AppArmor**: A Linux security module that confines programs to a limited set of resources.
-   **containerd and runc**: Harden the configuration of the container runtime.
-   **gVisor and RunTimeClass**: gVisor is a container sandbox. `RuntimeClass` is a feature for selecting the container runtime configuration to use to run a pod.
