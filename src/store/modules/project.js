const project = {
    state:{
        qdsearchKcArr:[],
        qdsearchNjArr:[],
    },
    mutations:{
        SET_qdsearchKcArr: (state, item) => {
            state.qdsearchKcArr = item;
        },
        SET_qdsearchNjArr: (state, item) => {
            state.qdsearchNjArr = item;
        },
    },
    actions:{
        get_qdsearchKcArr: ({ commit }, view) => {
            commit('SET_qdsearchKcArr', view)
        },
        get_qdsearchNjArr: ({ commit }, view) => {
            commit('SET_qdsearchNjArr', view)
        }
    }
};

export default project;