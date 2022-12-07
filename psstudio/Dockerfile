FROM python:3.7.4-slim
# FROM node:6.10.1-slim
ENV NODE_VERSION=14.15.1
RUN apt-get -y update  && apt-get -y install curl \
 build-essential
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

WORKDIR /home/predictsense/psstudio
# Make everything available for start
ADD requirements.txt /home/predictsense/psstudio
# Install requirements for python
RUN pip3 install -r requirements.txt

# FROM node:14.15.0
# WORKDIR /home/predictsense/psstudio
# Make everything available for start
ADD . /home/predictsense/psstudio

RUN npm install -g nodemon
# Install requirements for python
#RUN pip3 install -r requirements.txt
# Install Mean.JS Prerequisites
#RUN npm install -g grunt-cli
#RUN npm install -g bower
#RUN npm install -g pm2@3.5.2

# Install Mean.JS packages	
#ADD package.json /home/predictsense/psstudio/package.json
#RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
#ADD .bowerrc /home/predictsense/psstudio/.bowerrc
#ADD bower.json /home/predictsense/psstudio/bower.json
#RUN bower install --config.interactive=false --allow-root

#RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
#USER root
# Set development environment as default
#ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
#EXPOSE 3000 35729
# CMD ["node","server.js"]
