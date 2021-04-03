FROM mhart/alpine-node:14

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ../backend .
RUN yarn install && \
    yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
