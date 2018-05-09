<template>
  <div class="navbar" :class="active ? 'navbar--active' : ''">
    <div class="navbar-icon--wrapper">
      <div class="navbar-icon" @click.stop.prevent="active = !active" @keyup.enter="active = !active" tabindex="0">
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
            v-if="!(!active && item.subitem)"
            class="navbar-item"
            :class="($route.path.startsWith(item.path) ? 'navbar-item--active': '') + ' ' + (item.subitem ? 'navbar-item--subitem' : '')"
            :to="item.path">
            <i class="material-icons">{{ item.icon }}</i>
            <span v-if="active">{{ item.title }}</span>
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
    width: 50px;
    height: calc(100% - 70px - 1.5em);
    position: fixed;
    top: 1.5em;
    left: 0px;
    background-color: #333;
    color: white;
    z-index: 1000;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .navbar-item:focus, .navbar-icon:focus {
    outline: none;
  }

  .navbar.navbar--active {
    width: 300px;
    /* background: #333; */
    box-shadow: 2px 0 5px 0 rgba(0, 0, 0, 0.6);
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
  .navbar-item .material-icons {
    font-size: 32px;
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
    background: #555;
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
    font-size: 32px;
  }
</style>
