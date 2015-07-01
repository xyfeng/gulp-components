# Penske
## Setup
1. Install Node.js and NPM: [https://docs.npmjs.com/getting-started/installing-node](https://docs.npmjs.com/getting-started/installing-node)
2. Install Gulp: [https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## Run
This installs all the required node modules needed for the application. From the root folder, run:

```
npm install
```

After node has finished installing the modules, run the standard compile command:

```
gulp
```

To view the build in a browser, run the sync task. This will use Browser Sync to run a local server on port 3000 and open a new browser window running the build.

```
gulp sync
```

open url: [http://localhost:3000/documentation/](http://localhost:3000/documentation/)

sample layout page using flexbox grid: [http://localhost:3000/pages/layout.html](http://localhost:3000/pages/layout.html)
