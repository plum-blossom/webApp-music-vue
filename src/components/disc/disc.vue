<template>
	<!-- 推荐页详情 -->
    <transition name="slide">
      <!-- 传入参数songs title bgImage -->
        <music-list  :title="title" :bg-image="bgImage" :songs="songs"></music-list>  
    </transition>  
</template>
<script>
	import MusicList from 'components/music-list/music-list'
	import {mapGetters,mapActions } from 'vuex'
  	import {createRemdSong} from 'common/js/song'
  	import {getSongmsg} from 'api/song'
	export default {
		components:{MusicList},
		computed: {
	      title() {
	        return this.disc.name
	      },
	      bgImage() {
	        return this.disc.img
	      },
	      ...mapGetters([
	        'disc'
	      ])
	    },
	    data() {
	      return {
	        songs: []
	      }
	    },
	    created(){
	    	this._getSongList()
	    },
	    methods: {
		    _getSongList() {
		          let This = this
			      if (!This.disc.id) {
			        This.$router.push('/recommend')
			        return
			      }
			      This.http.remdListDetail(This.disc.id)
			        .then((res) => {
			          if (res.data.code === 200) {
			            let data = res.data.result.tracks
			            This.songs = This.normalizeSongs(data)

			            for (let i = 0; i < This.songs.length; i++) {
			              // 获取音乐url
			              getSongmsg(This.songs[i].id).then((res)=>{
			                This.songs[i].musicUrl = res.data[0].url
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
		    },
		    normalizeSongs (list) {
		      let retrn = []
		      list.forEach((item) => {
		        retrn.push(createRemdSong(item))
		      })
		      return retrn
		    },
		    handlePlaylist (playlist) {
		      const bottom = playlist.length > 0 ? '60px' : ''
		      this.$refs.list.$el.style.bottom = bottom
		      this.$refs.list.refresh()
		    }
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>