FROM node:onbuild

ADD . /usr/src/app

COPY ./entrypoint.sh /