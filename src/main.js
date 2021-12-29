import { createApp } from "vue";
import App from "./App.vue";

// import * as Vue from 'vue' // in Vue 3
import axios from "axios";
import VueAxios from "vue-axios";

import "./styles/app.css"; // Here
import router from "./router";
import store from "./store";

axios.defaults.withCredentials = true;

createApp(App).use(store).use(router).use(VueAxios, axios).mount("#app");
