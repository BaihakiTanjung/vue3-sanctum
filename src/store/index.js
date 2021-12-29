import Http from "../plugins/http";
import axios from "axios";
import { createStore } from "vuex";
import sharedMutations from "vuex-shared-mutations";
import router from "../router";

export default createStore({
  state() {
    return {
      user: null,
    };
  },
  getters: {
    user(state) {
      return state.user;
    },
    verified(state) {
      if (state.user) return state.user.email_verified_at;
      return null;
    },
    id(state) {
      if (state.user) return state.user.id;
      return null;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },

  actions: {
    async login({ dispatch }, payload) {
      try {
        await axios
          .get(`http://127.0.0.1:8000/sanctum/csrf-cookie`)
          .then(() => {
            Http.connection
              .post(`/login`, payload)
              .then((res) => {
                localStorage.setItem("token", res.data.access_token);
                Http.setAuthorizationHeader(localStorage.getItem("token"));

                dispatch("getUser");
              })
              .catch((err) => {
                throw err.response;
              });
          });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async register({ dispatch }, payload) {
      try {
        await Http.connection
          .post(`/register`, payload)
          .then((res) => {
            console.log(res);
            return dispatch("login", {
              email: payload.email,
              password: payload.password,
            });
          })
          .catch((err) => {
            throw err.response;
          });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async logout({ commit }) {
      await Http.connection
        .post(`/logout`)
        .then((res) => {
          console.log(res);
          commit("setUser", null);
          localStorage.removeItem("token");

          setTimeout(() => {
            router.push("/auth/login");
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getUser({ commit }) {
      await Http.connection
        .get(`/user`)
        .then((res) => {
          console.log(res);
          commit("setUser", res);

          setTimeout(() => {
            router.push("/");
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async profile({ commit }, payload) {
      await Http.connection
        .patch(`/profile`, payload)
        .then((res) => {
          commit("setUser", res.data.user);
        })
        .catch((err) => {
          throw err.response;
        });
    },

    async password(payload) {
      await Http.connection
        .patch("/password", payload)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          throw err.response;
        });
    },

    async verifyResend(payload) {
      let res = await Http.connection.connection.post(
        "/verify-resend",
        payload
      );
      if (res.status != 200) throw res;
      return res;
    },

    async verifyEmail({ dispatch }, payload) {
      let res = await Http.connection.connection.post(
        "/verify-email/" + payload.id + "/" + payload.hash
      );
      if (res.status != 200) throw res;
      dispatch("getUser");
      return res;
    },
  },
  plugins: [sharedMutations({ predicate: ["setUser"] })],
});
