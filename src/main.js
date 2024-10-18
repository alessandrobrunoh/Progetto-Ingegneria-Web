import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'

import Home from '@/components/Home'
import Contact from "@/components/Contact";
import About from "@/components/About";
import ERROR_404 from "@/components/errors/404";

const db = require('@/utils/database');

const routes = [
    {path: "/", component: Home},
    {path: "/contact", component: Contact},
    {path: "/about", component: About},
    {path: "/:pathMatch(.*)*", component: ERROR_404}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App)
    .use(router)
    .mount('#app')

