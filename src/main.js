import axios from 'axios';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import numbro from 'numbro';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

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
  return numbro(Number(value))
    .format(options);
});

/**
 * add axios interceptor to check for logout
 */
axios.defaults.baseURL = origin;
axios.interceptors.request.use((config) => {
  const headers = {
    'content-type': 'application/json',
  };
  if (store.state.auth.token != null) {
    headers.Authorization = `Bearer ${store.state.auth.token}`;
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      ...headers,
    },
  };
});

/**
 * start app
 */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
