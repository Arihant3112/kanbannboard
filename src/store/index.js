import Vue from "vue";
import Vuex from "vuex";
//modules
import TaskStore from "./TaskStore";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: {
      visible: false,
      type: "",
      message: "",
    },
  },
  getters: {
    getAlertState(state) {
      return state.alert;
    },
  },
  mutations: {
    setAlert(state, params) {
      state.alert = {};
      state.alert = params;
    },
  },
  actions: {
    showAlert({ commit }, params) {
      commit("setAlert", params);
    },
  },
  modules: {
    TaskStore,
  },
});
