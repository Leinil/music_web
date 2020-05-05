import Vue from 'vue'
import Vuex from 'vuex'
const baseUrl = 'http://47.101.145.34:3000';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sourceLoading: false,
    sourceList: [] as any[],
    currentPlayingMusicUrl: '',
    currentPlayingMusicDetail: {},
    // 判断是否已经添加过
    idsList: [] as string[],
    // 用这个id来判断是否与前一次发送的请求一致（url获取，歌单详情的获取）
    preIds: {
      getUrl: 0,
      getOneSource: 0
    } as { [key: string]: any },
    isMusicPlayInBigScreen: false,
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
    },
    changeBigScreenStatus(state, { payload }) {
      state.isMusicPlayInBigScreen = payload;
    },
    changeId(state, { payload }) {
      const { type, num } = payload;
      state.preIds[type] = num;
    },
  },
  actions: {
    getMusicUrl({ commit, state, dispatch }, { id, noUrlCallback }) {
      const { preIds: { getUrl } } = state;
      // 判断前后两次是否查询同一个资源
      if (id === getUrl) {
        commit({
          type: 'changeSourceLoading',
          payload: false
        })
        return
      }
      // 记录查询的资源id
      commit({
        type: 'changeId',
        payload: {
          type: 'getUrl',
          num: id
        }
      })
      fetch(`${baseUrl}/song/url?id=${id}`)
        .then(res => {
          return Promise.resolve(res.json());
        })
        .then(function (res) {
          if (res.code === 200) {
            const { data } = res;
            const { url = '' } = data[0];
            if (url) {
              dispatch({
                type: 'getMusicSource',
                id,
              })
              commit({
                type: 'changeCurrentUrl',
                payload: url
              })
            } else {
              // 执行一次异常返回
              noUrlCallback();
            }
            commit({
              type: 'changeSourceLoading',
              payload: false
            })
          }
        });
    },

    // 单个情况
    getMusicSource({ commit, state }, { id }) {
      // 判断是否已经添加过了（歌单列表中使用，其实可以不用的。。。）
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
