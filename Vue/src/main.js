import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import login from "@/pages/login.vue";
import register from "@/pages/register.vue";
import Home from "@/pages/Home.vue";
import Room from "@/pages/Room.vue";
import Profile from "@/pages/Profile.vue";
import Leaderboard from "@/pages/LeaderBoard.vue";
import Game from "@/pages/Game.vue";
import Settings from "@/pages/profileSettings.vue";
import Rules from "@/pages/Rules.vue";
import RoomBrowser from './pages/roomBrowser.vue';

const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/sign-in', component: login },
    { path: '/sign-up', component: register },
    { path: '/room/:code', component: Room, meta: { requiresAuth: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true }},
    { path: '/leaderboard/:code', component: Leaderboard, meta: { requiresAuth: true }},
    { path: '/game/:code', component: Game},
    { path: '/profile/settings', component: Settings, meta: { requiresAuth: true }},
    { path: '/rules', component: Rules, meta: { requiresAuth: true }},
    { path: '/rooms', component: RoomBrowser, meta: { requiresAuth: true }},

    { path: '/:pathMatch(.*)*', redirect: '/' }
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