# My Microservice

This project was bootstrapped with [create-microservice](https://www.npmjs.com/package/create-microservice)

## Quickstart

> - npm start

n.b. you might want to update name field in `package.json`.

## Batteries included

- file system based router
- build tools for node 6 ([github.com/zeit/micro#transpilation](https://github.com/zeit/micro#transpilation))
- livereload/pretty logs ([zeit.co/blog/micro-8](https://zeit.co/blog/micro-8))

## Building for node 6

n.b. this demo requires [docker](https://www.docker.com/) to be installed

From your terminal ...

> - docker run -it -p 3000:3000 -v $(pwd):/repo:ro mhart/alpine-node:6 sh

... then inside the container ...

> - \# install git and curl
> - apk update
> - apk upgrade
> - apk add git curl
> - \# setup project
> - cd
> - git clone /repo
> - cd repo
> - ls
> - export PATH=$(npm bin):$PATH
> - npm i

... server will fail until transpiled ...

> - \# prove service does not work
> - npm start
> - \# transpile async/await in index.js
> - mv routes src-routes
> - async-to-gen --out-dir routes/ src-routes/
> - \# now start again in background
> - npm start &

... then wait for service to start ...

> - \# prove service works!
> - curl -w '\n' localhost:3000
> - curl -w '\n' localhost:3000/lorem
> - curl -w '\n' localhost:3000/lorem/3
> - curl -w '\n' localhost:3000/echo\?foo=bar\&baz
> - curl -w '\n' localhost:3000 -X POST
> - curl -w '\n' localhost:3000 -X INVALIDMETHOD
> - curl -w '\n' localhost:3000/invalidpath

<style>
body { font-family: sans-serif; }
blockquote ul { font-family: monospace; color: purple; list-style-type: none; margin: 0; padding: 0; margin-left: -1em; }
blockquote li:before { content: '▲ '; }
</style>