# blanc

> A sleek and simple music player

## What is it

Blanc is a music player with a focus on being shiny. Which is why it might bring your PC to it's knees while indexing your music.

Once it's done and you start playing music: Hover over the album art for the play button. Click the arrow by the right for a beautiful no-chrome mode with a nice visualizer and shrunk controls.

It's currently in development, so if anything breaks, please:

1. Go to one of these paths and remove `Local Storage`, `Settings`, `Indexed DB`. You may also remove the `albumArts` folder, or remove them one by one and start the app after each file/folder you remove.
  - On Linux: `~/.config/blanc`
  - On Windows: `%APPDATA%\Roaming\blanc` (hit `Win+R` and type `appdata` then Enter.)
  - If it was during an upgrade, please remove `albums.db`, `colors.db`, `library.db` (if they exist) and restart the app.
2. Create an issue describing what happened when it broke and attach any log files in the folder above.

## So far it supports

1. Playing music
2. Viewing Albums
3. Global Media Shortcuts

## Todo

1. Playlists
2. Viewing Artists
3. UI Customizability

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
