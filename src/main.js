import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store/index";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import { app } from "./firebaseConfig";
import "./styles/index.scss";
Vue.config.productionTip = false;
const routes = [
  { name: "signin", path: "/", component: Login },
  { name: "home", path: "/home", component: Dashboard },
  { path: "/signup", component: Signup },
];
Vue.use(VueRouter);
new Vue({
  router: new VueRouter({
    routes,
  }),
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
