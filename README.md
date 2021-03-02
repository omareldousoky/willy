# fe-mohassel
Mohassel aggregate frontends

## lts-icons
- We use `icomoon` to generate our icon font
- Just go to [iconmoon projects](https://icomoon.io/app/#/projects)
- Import project -> choose `lts-icons.json` file in `fe-mohassel`
- Use `Import to set` to add new icons to our set from hamburger menu on the set
- Select the desired icon (append on current selection) then go to generate font
- Add new classes to `fe-mohassel/Shared/Assets/scss/_lts-icons.scss`
- Replace font file in `fe-mohassel/Shared/Assets/fonts/lts-icons`, we only use `.woff` font file
- Export project json file and replace `lts-icons.json` file with it
