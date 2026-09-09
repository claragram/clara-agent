FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssh-server \
    sudo \
    curl \
    git \
    ca-certificates \
    python3 \
    python3-pip \
    python3-venv \
    net-tools \
    iproute2 \
    procps \
    htop \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Setup SSH
RUN mkdir -p /var/run/sshd && \
    mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh

# Configure SSH settings
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config && \
    echo 'root:ubuntu' | chpasswd

# Setup user 'me' with sudo without password
RUN useradd -m -s /bin/bash me && \
    echo 'me:ubuntu' | chpasswd && \
    usermod -aG sudo me && \
    echo 'me ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    mkdir -p /home/me/.ssh && \
    chmod 700 /home/me/.ssh && \
    chown -R me:me /home/me/.ssh

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
