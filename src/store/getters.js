// 获取状态映射
export const singer = state => state.singer

// 播放器
// 播放状态
export const playing = state => state.playing
// 播放器展开状态
export const fullScreen = state => state.fullScreen
// 播放的数据
export const playlist = state => state.playlist
// 顺序列表
export const sequenceList = state => state.sequenceList
// 播放模式
export const mode = state => state.mode
// 当前播放索引
export const currentIndex = state => state.currentIndex
// 当前歌曲信息
export const currentSong = state => state.playlist[state.currentIndex] || {}
// 推荐歌单对象
export const disc = state => state.disc
// 排行榜歌单数据列表
export const topList = state => state.topList
// 历史记录
export const searchHistory = state => state.searchHistory
// 播放历史
export const playHistory = state => state.playHistory
// 收藏列表
export const favoriteList = state => state.favoriteList

// export const currentSongUrl = (state) => {
//   getSong(state.playlist[state.currentIndex]).then((res) => {
//     console.log(state.playlist, 'res')
//     return res.data.data.url || ''
//   })
// }
