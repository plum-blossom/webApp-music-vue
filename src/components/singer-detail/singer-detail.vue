<template>
  <!-- 歌手详情组件 -->
    <transition name="slide">
      <!-- 传入参数songs title bgImage -->
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>  

    </transition>  
</template>
<script>
import { mapGetters} from 'vuex' //获取state
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
import {getSongmsg} from 'api/song'
export default {
    components:{MusicList},
    data () {
      return {
        songs:[]
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.picUrl
      },
      //获取state
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getSingerDetil()
    },
    methods: {
      // 获取歌手详情
      _getSingerDetil(){
        // 在歌手详情页刷新时跳转到歌手页
        let This = this
        if (!This.singer.id) {
          This.$router.push('/singer')
          return
        }
        This.http.getArtists(This.singer.id)
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.hotSongs
            This.songs = This._normalizeSongs(data)
            for (let i = 0; i < This.songs.length; i++) {
              // 获取音乐url
              getSongmsg(This.songs[i].id).then((res)=>{
                if(res.code === 200){
                  This.songs[i].musicUrl = res.data[0].url
                }
                
              })
              // This.http.getMusicUrl(This.songs[i].id)
              //   .then(function (res) {
              //     if (res.data.code === 200) {
              //       This.songs[i].musicUrl = res.data.data[0].url
              //     }
              //   })
              //   .catch(function (err) {
              //     console.log(err)
              //   })
            }
          }
        })
        .catch(function (err) {
          console.log(err)
        })
      },
      _normalizeSongs(list){
        let retrn = []
        list.forEach((item) => {
          retrn.push(createSong(item))
        })
        return retrn
      }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)
</style>