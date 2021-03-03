# fe-mohassel

Mohassel aggregate frontends

### Getting Started

#### Installation

```bash
npm install
```

#### To run the frontend app in development mode on port 8081:

```bash
npm run start-login
# you have to run login first
npm run start-mohassel
```

##### Dev login credentials:

- username: `Devuser1`
- password: `L@123456`

#### Components:

we are using [Bootstrap-v4-rtl](https://github.com/MahdiMajidzadeh/bootstrap-v4-rtl)

#### Forms & Forms Validation:

we are using [formik](https://github.com/formium/formik)
and for forms validation [yup](https://formik.org/docs/guides/validation)

### State Management

we are using [Redux](https://react-redux.js.org/)

### Icons:

#### lts-icons

- We use `icomoon` to generate our icon font
- Just go to [iconmoon projects](https://icomoon.io/app/#/projects)
- Import project -> choose `lts-icons.json` file in `fe-mohassel`
- Use `Import to set` to add new icons to our set from hamburger menu on the set
- Select the desired icon (append on current selection) then go to generate font
- Add new classes to `fe-mohassel/Shared/Assets/scss/_lts-icons.scss`
- Replace font file in `fe-mohassel/Shared/Assets/fonts/lts-icons`, we only use `.woff` font file
- Export project json file and replace `lts-icons.json` file with it
