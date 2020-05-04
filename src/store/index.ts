import Vue from 'vue'
import Vuex from 'vuex'
import { baseUrl } from "@/utiles/ip";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sourceLoading: false,
    sourceList: [] as any[],
    currentPlayingMusicUrl: '',
    currentPlayingMusicDetail: {},
    // 判断是否已经添加过
    idsList: [] as string[],
  },
  mutations: {
    changeSourceLoading(state, { payload }) {
      state.sourceLoading = payload;
    },
    changeCurrentUrl(state, { payload }) {
      state.currentPlayingMusicUrl = payload;
    },
    changeCurrentDetail(state, { payload }) {
      state.currentPlayingMusicDetail = payload;
    },
    changeSourceList(state, { payload }) {
      state.sourceList.unshift(...payload);
    },
    changeIdsList(state, { payload }) {
      state.idsList.unshift(payload);
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

    getMusicSource({ commit, state }, { id }) {
      if (state.idsList.indexOf(id) !== -1) {
        fetch(`${baseUrl}/song/detail?ids=${id}`)
          .then(res => {
            return Promise.resolve(res.json());
          })
          .then(function (res) {
            if (res.code === 200) {
              const { songs } = res;
              commit({
                type: 'changeCurrentDetail',
                payload: songs[0]
              })
            }
          });
        return
      }
      commit({
        type: 'changeIdsList',
        payload: id
      })
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
            commit({
              type: 'changeCurrentDetail',
              payload: songs[0]
            })
          }
        });
    },
  },
  modules: {
  }
})
