import Dashboard from '@/layout/components/Dashboard.vue';
import Home from '@/layout/components/Home.vue';
import NotFound from '@/layout/components/NotFound.vue';
import router from '@/router';
import Editor from '@/editor/Editor.vue';

router.addRoutes([
  /*
   * MAIN ROUTES
   */
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      navigation: false,
      requiresAuth: false,
      label: 'Home',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      navigation: true,
      requiresAuth: true,
      label: 'Dashboard',
    },
  },
  {
    path: '/admin/editor',
    name: 'editor',
    component: Editor,
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
  // check auth here
  return next();
});
