<template>
  <div class="navbar" :class="active ? 'navbar--active' : ''">
    <div class="navbar-icon--wrapper">
      <div class="navbar-icon" @click="active = !active" @keyup.enter="active = !active" tabindex="0">
        <i class="material-icons">{{ active ? 'clear' : 'menu' }}</i>
      </div>
    </div>
    <nav class="navbar-items">
      <ul>
        <li
          v-for="item in items"
          :key="item.path"
          >
          <router-link
            :tabindex="active ? '0' : '-1'"
            class="navbar-item"
            :class="($route.path.startsWith(item.path) ? 'navbar-item--active': '') + ' ' + (item.subitem ? 'navbar-item--subitem' : '')"
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
export default {
  name: 'navbar',
  data: () => ({
    active: false,
    items: [
      {
        title: 'Library',
        icon: 'library_music',
        path: '/library'
      },
      {
        title: 'Albums',
        icon: 'subscriptions',
        path: '/library/album',
        subitem: true
      },
      {
        title: 'All Songs',
        icon: 'queue_music',
        path: '/library/all',
        subitem: true
      },
      {
        title: 'Settings',
        icon: 'settings',
        path: '/settings'
      },
      {
        title: 'Libraries',
        icon: 'library_music',
        path: '/settings/library',
        subitem: true
      },
      {
        title: 'Development',
        icon: 'code',
        path: '/settings/development',
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
    width: 24px;
    height: 24px;
    position: fixed;
    top: 1.7em;
    left: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .navbar.navbar--active {
    width: 300px;
    /* background: #333; */
    left: 0;
    top: 1.5em;
    height: 100%;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
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
  }
  .navbar-items li a {
    display: flex;
    text-decoration: none;
    color: inherit;
  }

  .navbar-item.navbar-item--subitem {
    padding-left: 2em;
  }

  .navbar-items li:hover, .navbar-item--active {
    background: #666;
  }

  .navbar-items li a > * {
    margin: 0 5px;
  }

  .navbar-items li a span {
    line-height: 24px;
    text-transform: uppercase;
    font-weight: lighter;
  }

  .navbar:hover .navbar-items {
    display: block;
  }

  .navbar-icon--wrapper {
    position: relative;
    width: 100%;
    height: 24px;
    padding: 0;
    margin: 0;
  }
  .navbar-icon {
    cursor: pointer;
    position: absolute;
    right: 0;
  }
</style>
