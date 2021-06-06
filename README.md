# fe-mohassel

Mohassel aggregate frontends

## Getting Started

### Installation

```bash
npm install
```

### To run the frontend app in development mode on port 8081:

```bash
npm run start-login
# you have to run login first
npm run start-mohassel
```

#### Dev login credentials:

- username: `Devuser1`
- password: `L@123456`

### Components:

we are using [Bootstrap-v4-rtl](https://github.com/MahdiMajidzadeh/bootstrap-v4-rtl)

### Forms & Forms Validation:

we are using [formik](https://github.com/formium/formik)
and for forms validation [yup](https://formik.org/docs/guides/validation)

## State Management

we are using [Redux](https://react-redux.js.org/)

## Icons:

### lts-icons

- We use `icomoon` to generate our icon font
- Just go to [iconmoon projects](https://icomoon.io/app/#/projects)
- Import project -> choose `lts-icons.json` file in `fe-mohassel`
- Use `Import to set` to add new icons to our set from hamburger menu on the set
- Select the desired icon (append on current selection) then go to generate font
- Add new classes to `fe-mohassel/Shared/Assets/scss/_lts-icons.scss`
- Replace font file in `fe-mohassel/Shared/Assets/fonts/lts-icons`, we only use `.woff` font file
- Export project json file and replace `lts-icons.json` file with it

## Webpack Config

### Errors

- We ran into this error from redux:

```
You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.
```

that was due to build enhancements, uglify code including `node_modules` unconditionally, redux was complaining that we are uglifying but hey you forgot to set env to production so this is fixed by uglifying only in prod mode

### Source map

- As per ts-loader we should set `"sourceMap": true` in `tsconfig.json` as per [webpack loader docs](https://webpack.js.org/guides/typescript/#source-maps)
- Also we found out that `eval` devtool is recommended for development, but when we tried it source maps for styles were gone, found out that this is related to `sass-loader` [version 8 docs](https://github.com/webpack-contrib/sass-loader/releases/tag/v8.0.0) that `eval` value not working with source maps
- On trying `inline-source-map` style worked but `ts(x)` files didn’t, but worked fine with `source-map` not sure why
