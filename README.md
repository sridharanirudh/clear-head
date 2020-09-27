# Serenity

### Install Flask
```shell
pip install Flask
```

### Install NPM, Node, Webpack, and other dependencies

Install NPM and Node (version 8 or higher) from either [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [here](https://github.com/nvm-sh/nvm)

Installing Webpack
```shell
npm install -g webpack
npm install -g webpack-cli
```

```shell
npm install
```
### To initialize database
```
flask db init
flask db migrate
flask db upgrade
```

### To run the app
```shell
export FLASK_APP=run.py
flask run
webpack --watch
```
