import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ChartComponent from './components/ChartComponent.vue';
import HelloWorld from './components/HelloWorld.vue';
import Daka from './components/Daka.vue';
import Countdown from './components/Countdown.vue';
import ChartPie from './components/ChartPie.vue';
import ChartBar from './components/ChartBar.vue';
const routes = [
    {
        path: '/',
        component: HelloWorld
    },
    {
        path: '/notion/chart',
        component: ChartComponent
    },
    {
        path: '/notion/daka',
        component: Daka,
        props: route => ({ title: route.query.title, ip: route.query.ip, id: route.query.id })
    },
    {
        path: '/notion/countdown',
        component: Countdown
    },
    {
        path: '/notion/pie',
        component: ChartPie
    },
    {
        path: '/notion/bar',
        component: ChartBar
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');
