<template>
	<!-- 排行详情 -->
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
	import MusicList from 'components/music-list/music-list'
 	import {mapGetters} from 'vuex'
 	import { createSong } from 'common/js/song'
 	import {getSongmsg} from 'api/song'

 	export default{
 		computed: {
	      title() {
	        return this.topList.name
	      },
	      bgImage() {
	        return this.topList.creator ? this.topList.creator.backgroundUrl : ''
	      },
	      ...mapGetters([
	        'topList'
	      ])
	    },
	    data(){
	    	return {
	    		songs:[],
	    		rank:true
	    	}
	    },
	    created(){
	    	this._getMusicList()
	    },
	    methods:{
	    	_getMusicList(){
	    	  	let This = this
		      if (!This.topList.id) {
		        This.$router.push('/rank')
		        return
		      }
		      This.songs = This.normalizeSongs(This.topList.tracks)
		      for (let i = 0; i < This.songs.length; i++) {
		        // 获取音乐url
		        // This.http.getMusicUrl(This.songs[i].id)
		        //   .then(function (res) {
		        //     if (res.data.code === 200) {
		        //       This.songs[i].musicUrl = res.data.data[0].url
		        //     }
		        //   })
		        //   .catch(function (err) {
		        //     console.log(err)
		        //   })
		        getSongmsg(This.songs[i].id).then((res)=>{
		        	if (res.code === 200) {
		              This.songs[i].musicUrl = res.data[0].url
		            }
	            })
		      }
	    	},
    		normalizeSongs (list) {
		      let retrn = []
		      list.forEach((item) => {
		        retrn.push(createSong(item))
		      })
		      return retrn
		    }					
	    },
	    components:{
	    	MusicList
	    }
 	}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>