import PageEditor from '@/areas/PageEditor.vue';
import PageGames from '@/games/PageGames.vue';
import PageHome from '@/PageHome.vue';
import NotFound from '@/layout/components/NotFound.vue';
import router from '@/router';
import store from '@/store';

router.addRoutes([
  /*
   * MAIN ROUTES
   */
  {
    path: '/',
    name: 'home',
    component: PageHome,
    meta: {
      navigation: false,
      requiresAuth: false,
      label: 'Home',
    },
  },
  {
    path: '/games',
    name: 'games',
    component: PageGames,
    meta: {
      navigation: true,
      requiresAuth: true,
      label: 'Games',
    },
  },
  {
    path: '/admin/editor',
    name: 'editor',
    component: PageEditor,
    meta: {
      navigation: true,
      requiresAuth: true,
      label: 'Editor',
    },
  },
  /*
   * 404
   */
  {
    path: '*',
    name: '404',
    component: NotFound,
  },
]);

/**
 * init auth route guards
 */
router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    return next();
  }
  if (!store.state.auth.user) {
    return next({ name: 'home' });
  }
  return next();
});
