import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

// 状态管理
const state ={
    singer:{}, //歌手
    // 播放器
    playing:false,//播放状态
    fullScreen:false,//播放器展开状态
    playlist:[],//播放的数据
    sequenceList:[],//顺序列表
    mode:playMode.sequence, //播放模式
    currentIndex:-1, //当前播放索引
    disc:{}, //推荐歌单对象
    topList:{}, //排行榜详情数据列表
    searchHistory: loadSearch(),//历史数据
    playHistory: loadPlay(),//播放历史数据
    favoriteList: loadFavorite() //收藏数据
}
export default state