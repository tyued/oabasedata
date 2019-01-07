import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),       
    },
    sidebarcurMenuId:Cookies.get('sidebarcurMenuId'),
    sidebarcurMenu:'dashboard',       //首页 
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    visitedViews: []
  },
  mutations: {
    TOGGLE_SIDEBAR: (state,view) => {
      if (view.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !view.opened;
      state.sidebar.curMenuId = view.curMenuId;
    },
    Set_CurMenuId:(state,view) => {
      Cookies.set('sidebarcurMenuId', view);
      state.sidebarcurMenuId = view;
    },
    Set_CurMenu:(state,view) => {
      state.sidebarcurMenu = view;
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({ name: view.name, path: view.path, params: view.params })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ToggleSideBar: ({ commit } , view) => {
      commit('TOGGLE_SIDEBAR',view)
    },
    SetCurMenuId: ({ commit } , view) => {
      commit('Set_CurMenuId',view)
    },
    SetCurMenu: ({ commit } , view) => {
      commit('Set_CurMenu',view)
    },
    addVisitedViews: ({ commit }, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({ commit }, view) => {
      commit('DEL_VISITED_VIEWS', view)
    }
  }
};

export default app;
