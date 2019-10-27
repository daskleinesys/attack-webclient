import Dashboard from '@/layout/components/Dashboard.vue';
import Home from '@/layout/components/Home.vue';
import NotFound from '@/layout/components/NotFound.vue';
import router from '@/router';

router.addRoutes([
  /*
   * MAIN ROUTES
   */
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: false,
      label: 'Home',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      label: 'Dashboard',
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
