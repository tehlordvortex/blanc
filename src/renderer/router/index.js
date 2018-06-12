import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/library',
      component: require('@/components/Library/LandingPage').default,
      children: [
        {
          path: '',
          name: 'library-all-songs-page',
          component: require('@/components/Library/AllSongsPage').default
        },
        {
          path: 'album/:album?',
          name: 'library-album-page',
          component: require('@/components/Library/AlbumPage').default
        },
        {
          path: 'playlists/:playlistID?',
          name: 'library-playlist-page',
          component: require('@/components/Library/PlaylistsPage').default
        }
      ]
    },
    {
      path: '/settings',
      component: require('@/components/Settings/Index.vue').default,
      children: [
        {
          path: '',
          name: 'settings-library-page',
          component: require('@/components/Settings/Library.vue').default
        },
        {
          path: 'development',
          name: 'settings-development-page',
          component: require('@/components/Settings/Development.vue').default
        },
        {
          path: 'about',
          name: 'settings-about-page',
          component: require('@/components/Settings/About.vue').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
