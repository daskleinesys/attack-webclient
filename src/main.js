import axios from 'axios';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import numbro from 'numbro';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// do not change order of the following imports (to avoid circular imports)
import router from '@/router';
import store from '@/store';
import '@/initRouter';

import { ORIGIN_API } from '@/shared/constants';

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
axios.defaults.baseURL = ORIGIN_API;
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
axios.interceptors.response.use(response => response, async (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch('auth/logout');
  }
  throw error;
});

/**
 * start app
 */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
