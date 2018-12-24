import axios from 'axios'
// 获取歌曲信息
export function getSongmsg(song_id) {
  const url = "https://api.imjad.cn/cloudmusic/";
  const params = {
    type:"song",
    id: song_id,
    br: 128000
  }
  return axios.get(url,{params:params}).then((res) => {
    return Promise.resolve(res.data)
  })
}