# On Tap: The CC Beer App.
http://ontap.common.io


### Get hacking

- Check out the [MVP Project](https://github.com/commoncode/ontap/projects/1) on Github.
- Use [Github Issues](https://github.com/commoncode/ontap/issues) for feature requests, bugs, etc.
- When developing, use [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) and open a PR.
- There's a #beer channel in Flowdock


### The basics
- Server lives in `/server`, client lives in `/client`.
- The server runs [Express](https://expressjs.com) and uses [Sequelize](https://sequelizejs.com) as an ORM.
  - It serves the client app bundle at /
  - It serves a REST API at /api/v1
- The client's a basic React app that gets built using [Pack](https://www.npmjs.com/package/pack-cli)


### Installation & Development

To fire it up locally:

```
# requires node 6.5+
# clone the repo
git clone git@github.com:commoncode/ontap
cd ontap
cp .env.example .env
# add any missing vars to .env file (ask dev team)
npm install
npm run build
npm run start
```

There are a few useful scripts for development, run them all with `npm run {script}`

- **start**: run the Express server
- **dev**: run the Express server, restart when `/server/*` is modified
- **build**: build the React app to `/client/dist`
- **watch**: runs a Webpack dev server, hot reloads changes in `/client/src`
- **test**: runs test with Mocha
- **lint**: eslint server and client


### Deployment

Bit flaky right now. [ontap.common.io](http://ontap.common.io) runs on a Digital Ocean box. Ask Mork for access if you want to deploy yourself.

**TODO:** get it to deploy on successful merges to `master`
