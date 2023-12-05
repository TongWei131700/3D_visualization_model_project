const trajectory = {
  namespaced: true,
  state: {

    //  轨迹线websocket
    lineWebsocket: {},
  },
  getters: {
    /* 与防区和轨迹线的getters */
    getLineWebsocket: (state) => state.lineWebsocket,
    getProgramTitle: () => "智慧哨兵",
  },
  mutations: {

    // 轨迹线websocket
    setLineWebsocket: (state, payload) => {
      state.lineWebsocket = payload;
    },

  },
  actions: {
    openLineWebsocket: ({
                          commit
                        }, payload) => {
      // "ws://10.10.2.67:8081/index/radar_data"
      let websocket = new WebSocket(payload);
      websocket.onopen = () => {
        console.log("line  websocket连接成功", websocket);
        commit('setLineWebsocket', websocket);
      };
    },
  }
};

export default trajectory;
