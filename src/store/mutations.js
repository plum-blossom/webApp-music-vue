import * as types from './mutation-types'
// 修改
const mutations = {
    //修改歌手 方法名：SET_SINGER  state（获取的state来之state.js） singer（要修改的值）
    [types.SET_SINGER](state,singer){
        state.singer = singer
    },
    // 播放器内核
    [types.SET_PLAYING_STATE](state,flag){
        state.playing  = flag
    },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullScreen  = flag
    },
    [types.SET_PLATLIST](state,list){
        state.playlist  = list
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList  = list
    },
    [types.SET_PLAY_MODE](state,mode){
        state.mode  = mode
    },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex  = index
    },
    [types.SET_DISC](state,disc){
        state.disc  = disc
    },
    [types.SET_TOP_LIST](state,list){
        state.topList  = list
    },
    [types.SET_SEARCH_HISTORY] (state, history) {
        state.searchHistory = history
    },
    [types.SET_PLAY_HISTORY] (state, history) {
        state.playHistory = history
    },
    [types.SET_FAVORITE_LIST] (state, list) {
        state.favoriteList = list
    }
}
export default mutations