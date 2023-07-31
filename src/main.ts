import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import '@/styles/main.scss';
import { MyButton, MyFooter } from './components/atoms';

const app = createApp(App);

console.log('use i18', i18n);
app.use(i18n);

console.log('use router', router);
app.use(router);

app.component('MyFooter', MyFooter).component('MyButton', MyButton);

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
