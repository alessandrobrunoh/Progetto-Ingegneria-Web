import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SignIN from "@/components/SignIN.vue";
import SignUP from "@/components/SignUP.vue";
import Home from "@/components/Home.vue";
import Room from "@/components/Create.vue";
import Profile from "@/components/Profile.vue";

const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/sign-in', component: SignIN },
    { path: '/sign-up', component: SignUP },
    { path: '/room', component: Room, meta: { requiresAuth: true } }, // TODO: Da aggiungere /:id per la stanza
    { path: '/profile', component: Profile, meta: { requiresAuth: true }}
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        console.log('Not authenticated, redirecting to login');
        next({ path: '/sign-in' });
    } else {
        next();
    }
});

createApp(App)
    .use(router)
    .mount('#app');