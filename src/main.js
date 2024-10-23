import {createApp} from 'vue'; //importo solo la funzione createApp di vue e non tutto vue
import App from './App.vue';

import {createRouter, createWebHashHistory} from 'vue-router'; //importo le funzioni di "vue-router" che voglio usare per definire le rotte

//importo i componenti che voglio usare
import Home from "@/components/Home.vue";
import Contact from "@/components/Contact.vue";
import About from "@/components/About.vue";
import Fetch from "@/components/api/Fetch.vue";
import Game from "@/components/Game_State/Game.vue";

// creo e imposto il router
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/", component: Home},
        {path: "/contact", component: Contact},
        {path: "/about", component: About},
        {path: "/fetch", component: Fetch},
        {path: "/game", component: Game},
]});

// creo l'applicazione e la monto usando il router
createApp(App)
    .use(router)
    .mount('#app');