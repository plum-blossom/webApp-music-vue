import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// mutations修改state在控制台打印出其修改的相关信息
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 调试工具检测是否是mutations修改 否报错
const debug = process.env.NODE_ENV !== "production" 

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict:debug,
    plugins:debug ? [createLogger()] : [] 
}) 