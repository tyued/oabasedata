import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import project from './modules/project';
import getters from './getters';
import division from './modules/division';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    project,
    division
  },
  getters
});

export default store
