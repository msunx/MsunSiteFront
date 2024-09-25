import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ChartComponent from './components/ChartComponent.vue';
import HelloWorld from './components/HelloWorld.vue';
import Daka from './components/Daka.vue';
import Countdown from './components/Countdown.vue';

const routes = [
    {
        path: '/MsunSiteFront',
        component: HelloWorld
    },
    {
        path: '/MsunSiteFront/notion/chart',
        component: ChartComponent
    },
    {
        path: '/MsunSiteFront/notion/daka',
        component: Daka,
        props: route => ({ title: route.query.title }) // 通过路由参数传递 title
    },
    {
        path: '/MsunSiteFront/notion/countdown',
        component: Countdown
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');
