import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ChartComponent from './components/ChartComponent.vue';
import HelloWorld from './components/HelloWorld.vue'

const routes = [
    {
        path: '/MsunSiteFront',
        component: HelloWorld
    },
    {
        path: '/MsunSiteFront/notion/chart',
        component: ChartComponent
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');
