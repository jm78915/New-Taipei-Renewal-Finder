import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from 'leaflet';

import App from './App.vue';
import router from './router';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: new URL(
        'leaflet/dist/images/marker-icon-2x.png',
        import.meta.url,
    ).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url)
        .href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)
        .href,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
