import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import SignUp from "./pages/SignUp.vue";
import CoreHours from "./pages/Core.vue";
import Accounts from "./pages/Accounts.vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "login", path: "/", component: Login},
        {name: "home-page", path: "/home", component: Home},
        {name: "sign-up", path: "/sign-up", component: SignUp},
        {name: "core", path: "/core", component: CoreHours},
        {name: "accounts", path: "/accounts", component: Accounts}
    ]
});

import App from "./App.vue";

new Vue({
   el: "#app",
   data: {
       currentUser: null
   },
   router,
   render: h => h(App)
});
