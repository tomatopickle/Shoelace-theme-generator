import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import ShoelaceModelDirective from '@shoelace-style/vue-sl-model'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.73/dist/');

import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(ShoelaceModelDirective);
app.mount('#app');

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("sl-theme-dark");
}