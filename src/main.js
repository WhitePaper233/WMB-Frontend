import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";


import "../style.css";
import "element-plus/dist/index.css";


const home = () => import("./HomeApp.vue");
const comments = () => import("./CommentsApp.vue");
const indexComment = () => import("./CommentsIndexApp.vue");
const allComments = () => import("./CommentsAllApp.vue");

const routes = [
    { 
        path: "/",
        component: home, 
    },
    { 
        path: "/comments",
        component: comments,
        children: [
            {
                path: "",
                name: "留言",
                component: indexComment,
            },
            {
                path: "all",
                name: "全部留言",
                component: allComments,
            }
        ],
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
