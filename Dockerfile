FROM node:6-onbuild

ADD . /usr/src/app

COPY ./entrypoint.sh /
