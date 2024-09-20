# Base Docker image for Ubuntu as used in GitHub actions
# Use this for interactively exploring/testing the things you want
# to do in the GitHub actions
# To run a container from this image, use the following command:
# docker run -it --rm strazdinsg/rebus-github-actions:latest
# The source code of this repository will be available in /app

FROM ubuntu:latest

# Install required packages
RUN apt update && apt install -y \
    git curl unzip \
    build-essential \
    python3 python3-pip \
    jq \
    docker.io \
    && apt clean

# Set up JDK 21
RUN cd / && mkdir java && cd java \
    && curl -L -o jdk.tar.gz curl -L -o jdk.tar.gz https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.4%2B7/OpenJDK21U-jdk_aarch64_linux_hotspot_21.0.4_7.tar.gz \
    && tar -xzf jdk.tar.gz \
    && rm jdk.tar.gz \
    && mv jdk-21.0.4+7 jdk \
    && update-alternatives --install /usr/bin/java java /java/jdk/bin/java 100
ENV JAVA_HOME=/java/jdk

# Set up maven
RUN cd / && mkdir maven && cd maven \
    && curl -L -o maven.tar.gz https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz \
    && tar -xzf maven.tar.gz \
    && rm maven.tar.gz \
    && mv apache-maven-3.9.9/* . \
    && rm -rf apache-maven-3.9.9 \
    && export PATH=$PATH:/maven/bin
ENV PATH=$PATH:/maven/bin

# Set up Node
RUN cd / && mkdir node && cd node \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" \
    && nvm install 20

# Clone Git repo
RUN mkdir /app && cd /app \
    && git clone https://github.com/strazdinsg/rebus.git .

# Run tests and download all Maven dependencies \
RUN cd /app/backend \
    && mvn test -Dspring-boot.run.profiles=test -DTEST_JWT_SECRET_KEY=12345678901234567890123456789012 -Dorg.slf4j.simpleLogger.defaultLogLevel=error

# Set up PNPM \
RUN curl -fsSL https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash - \
    && export PNPM_HOME="/root/.local/share/pnpm" \
    && export PATH="$PNPM_HOME:$PATH"
