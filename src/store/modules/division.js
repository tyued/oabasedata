const division = {
  state: {
    ranklist: [],
    copyranklist: [],
    schoolCode: '',
    batch: ''
  },
  mutations: {
    SET_schoolCode: (state, type) => {
      state.schoolCode = type
    },
    SET_batch: (state, type) => {
      state.batch = type
    },
    SET_ranklist: (state, type) => {
      state.ranklist = type;
    },
    SET_copyranklist: (state, type) => {
      state.copyranklist = type
    }
  },
  actions: {
    set_schoolCode: ({ commit }, view) => {
      commit('SET_schoolCode', view)
    },
    set_batch: ({ commit }, view) => {
      commit('SET_batch', view)
    },
    set_ranklist: ({ commit }, view) => {
      commit('SET_ranklist', view)
    },
    set_copyranklist: ({commit}, view) => {
      commit('SET_copyranklist', view)
    }
  }
};
export default division;