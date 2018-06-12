<template>
  <div class="navbar" :class="active ? 'navbar--active' : ''">
    <!-- <div class="navbar-icon--wrapper">
      <div class="navbar-icon" @click.stop.prevent="active = !active" @keyup.enter="active = !active" tabindex="0">
        <i class="material-icons">{{ active ? 'clear' : 'menu' }}</i>
      </div>
    </div> -->
    <nav class="navbar-items">
      <ul>
        <li
          v-for="item in items"
          :key="item.title"
          >
          <span class="navbar-group-header" v-if="item.header">{{ item.title }}</span>
          <router-link
            v-else
            class="navbar-item"
            :class="($route.path === (item.path) ? 'navbar-item--active': '')"
            :to="item.path">
            <i class="material-icons">{{ item.icon }}</i>
            <span>{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
// import { getColors, loadAlbumArt } from '@/lazy-loaders'

export default {
  name: 'navbar',
  data: () => ({
    active: true,
    items: [
      {
        title: 'Library',
        header: true
      },
      {
        title: 'All Songs',
        icon: 'queue_music',
        path: '/library',
        subitem: true
      },
      {
        title: 'Albums',
        icon: 'subscriptions',
        path: '/library/album',
        subitem: true
      },
      {
        title: 'Playlists',
        icon: 'playlist_play',
        path: '/library/playlists',
        subitem: true
      },
      {
        title: 'Settings',
        header: true
      },
      {
        title: 'Libraries',
        icon: 'library_music',
        path: '/settings',
        subitem: true
      },
      {
        title: 'Development',
        icon: 'code',
        path: '/settings/development',
        subitem: true
      },
      {
        title: 'About',
        icon: 'help',
        path: '/settings/about',
        subitem: true
      }
    ]
  }),
  watch: {
    '$route' () {
      this.active = false
    }
  },
  methods: {
    keyup ($e) {
      console.log($e)
    }
  }
}
</script>

<style>
  .navbar {
    width: 300px;
    height: 100%;
    /* position: fixed; */
    top: 1.5em;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    z-index: 100;
    transition: all 0.3s;
    overflow: hidden;
  }

  .navbar-group-header {
    font-weight: 200;
    text-transform: uppercase;
    color: #555;
    height: 2em;
    display: block;
    padding: 0.5em 1em;
  }
  .navbar-item:focus, .navbar-icon:focus {
    outline: none;
  }

  .navbar.navbar--active {
    width: 300px;
    /* background: #333; */
    /* box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.6); */
  }
  .navbar-items ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .navbar-items li {
    display: block;
    width: 100%;
  }

  .navbar-items .navbar-item {
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    padding-left: 2em;
  }
  .navbar-item .material-icons {
    font-size: 26px;
  }
  .navbar-items li a {
    display: flex;
    text-decoration: none;
    color: inherit;
  }

  .navbar-item.navbar-item--subitem {
    padding-left: 2em;
  }

  .navbar-item:focus, .navbar-icon--wrapper:hover, .navbar-items .navbar-item:hover, .navbar-item--active {
    background: rgba(0, 0, 0, 0.3);
    color: white;
  }

  .navbar-items li a > * {
    margin: 0 5px;
  }

  .navbar-items li a span {
    line-height: 24px;
    font-weight: lighter;
  }

  .navbar:hover .navbar-items {
    display: block;
  }

  .navbar-icon--wrapper {
    position: relative;
    width: 100%;
    height: 2em;
    padding: 0;
    margin: 0;
    transition: background-color 0.3s;
  }
  .navbar-icon {
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .navbar--active .navbar-icon {
    position: absolute;
    left: 100%;
    transform: translateX(-100%)
  }
  .navbar-icon .material-icons {
    font-size: 26px;
  }
  .navbar-item {
    align-items: center;
  }
</style>
