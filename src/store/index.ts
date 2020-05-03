import Vue from 'vue'
import Vuex from 'vuex'
import { baseUrl } from "@/utiles/ip";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sourceLoading: false,
    sourceList: [] as any[],
    currentPlayingMusicUrl: '',
  },
  mutations: {
    changeSourceLoading(state, { payload }) {
      state.sourceLoading = payload;
    },
    changeCurrentUrl(state, { payload }) {
      state.currentPlayingMusicUrl = payload;
    },
    changeSourceList(state, { payload }) {
      state.sourceList.push(...payload);
    }
  },
  actions: {
    getMusicUrl({ commit }, { id }) {
      fetch(`${baseUrl}/song/url?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function (res) {
          if (res.code === 200) {
            const { data } = res;
            const { url = '' } = data[0];
            commit({
              type: 'changeCurrentUrl',
              payload: url
            })
            commit({
              type: 'changeSourceLoading',
              payload: false
            })
          }
        });
    },

    getMusicSource({ commit }, { id }) {
      fetch(`${baseUrl}/song/detail?ids=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function (res) {
          if (res.code === 200) {
            const { songs } = res;
            commit({
              type: 'changeSourceList',
              payload: songs
            })
          }
        });
    },
  },
  modules: {
  }
})
