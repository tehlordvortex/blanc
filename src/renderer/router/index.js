import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/library',
      name: 'library-landing-page',
      component: require('@/components/Library/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
