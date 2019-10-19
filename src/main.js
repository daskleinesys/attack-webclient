import axios from 'axios';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import numbro from 'numbro';

// do not change order of the following imports (to avoid circular imports)
import router from '@/router';
import store from '@/store';
import '@/initRouter';

import { origin } from '@/shared/constants';

import App from '@/App.vue';

/**
 * basic vue setup
 */
Vue.config.productionTip = false;
Vue.use(BootstrapVue);

/**
 * setup numbro
 */
numbro.setDefaults({
  thousandSeparated: true,
  mantissa: 2,
});
Vue.filter('numbro', (value, options) => {
  if (Number.isNaN(value)) {
    return null;
  }
  return numbro(Number(value)).format(options);
});

/**
 * add axios interceptor to check for logout
 */
axios.defaults.baseURL = origin;

/**
 * start app
 */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
