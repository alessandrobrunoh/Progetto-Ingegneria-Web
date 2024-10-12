import {createApp} from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/HelloWorld.vue'
import Test from "./router/TestComponent.vue";
import HelloWorld from "@/components/HelloWorld.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/test", component: Test },
        { path: "/hello", component: HelloWorld }
    ]
});

createApp(App)
    .use(router)
    .mount('#app')

