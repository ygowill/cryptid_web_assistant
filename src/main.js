import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueI18n);

Array.prototype.shuffle = function() {
  let array = this;
  let m = array.length,
      t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

new Vue({
  render: h => h(App),
}).$mount('#app')
