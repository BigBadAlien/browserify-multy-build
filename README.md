### browserify-multy-build

Browserify ES2015 code build with many points of entry. Entry of browserify bundles determined by filename starting with capital letter, like `Foobar.js`.

* Sources get from `src` folder and build in `build` folder.
* Errors displayed in native OS message system.
* Production and development environment configuration located in .env file.
* Inline sourcemaps included in development mode.

#### Installation
```
npm install
npm install gulp -g
```

#### Using
`gulp scripts-watch` - watch/build task.

`gulp scripts-build` - build task.
