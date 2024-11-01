import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SignIN from "@/components/SignIN.vue";
import About from "@/components/About.vue";
import Home from "@/components/Home.vue";
import axios from "axios";

const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/login', component: SignIN },
    { path: '/about', component: About, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        console.log('Not authenticated, redirecting to login');
        next({ path: '/login' });
    } else {
        next();
    }
});

createApp(App)
    .use(router)
    .mount('#app');