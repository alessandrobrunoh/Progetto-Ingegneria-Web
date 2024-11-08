import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SignIN from "@/pages/SignIN.vue";
import SignUP from "@/pages/SignUP.vue";
import Home from "@/pages/Home.vue";
import Room from "@/pages/Room.vue";
import Profile from "@/pages/Profile.vue";
import Leaderboard from "@/pages/LeaderBoard.vue";
import Game from "@/pages/Game.vue";
import Settings from "@/pages/profileSettings.vue";
import Rules from "@/pages/Rules.vue";

const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/sign-in', component: SignIN },
    { path: '/sign-up', component: SignUP },
    { path: '/room/:roomCode', component: Room, meta: { requiresAuth: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true }},
    { path: '/leaderboard', component: Leaderboard, meta: { requiresAuth: true }},
    { path: '/:pathMatch(.*)*', redirect: '/' },
    { path: '/game', component: Game},
    { path: '/profile/settings', component: Settings, meta: { requiresAuth: true }},
    { path: '/rules', component: Rules, meta: { requiresAuth: true }}
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