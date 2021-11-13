import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueI18n);

new Vue({
  render: h => h(App),
}).$mount('#app')
