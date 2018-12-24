<template>
	<!-- 搜索结果组件 -->
	<scroll ref="suggest"
			class="suggest"  
			:data="songs" 
			:pullup="pullup" 
			@scrollToEnd="searchMore"  
			:beforeScroll="beforeScroll" 
			@beforeScroll="listScroll">
		<ul class="suggest-list" v-show="!searchShow && !searchShow && query && songs.length > 0" ref="suggestList" >
			<li @click="selectItem(item)" class="suggest-item" v-for="item in songs">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="haveMore && query"></loading>
		</ul>
	    <div v-show="!haveMore && !songs.length && query" class="no-result-wrapper">
	    	<no-result title="抱歉，暂无搜索结果"></no-result>
	    </div>
	</scroll>
	
</template>
<script>
	import Scroll from 'base/scroll/scroll'
  	import Loading from 'base/loading/loading'
  	import noResult from 'base/no-result/no-result'
  	import {createSearchSong} from 'common/js/song'
  	import Singer from 'common/js/singer'
  	import {mapMutations, mapActions} from 'vuex'
  	import {getSongmsg} from 'api/song'
  	const TYPE_SINGER = 'singer'
  	const perpage = 20

	export default {
		components:{
			Scroll,
			Loading,
			noResult
		},
		props:{
			query:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				singer:{},
				songs:[],
				suggest:{},
				pullup:true,
				haveMore:true,
				page:1,
				searchShow:true,
				beforeScroll:true //手机键盘控制	
			}
		},
		methods:{
			getIconCls(item){
				if(item.type === TYPE_SINGER){
					return 'icon-mine'
				}else{
					return 'icon-music'
				}
			},
			getDisplayName(item){
				if(item.type ===TYPE_SINGER){
					return item.name
				}else{
					return `${item.songName} - ${item.singerName}`
				}
				
			},
			// 获取数据
			getSuggest(){
				this.searchShow = false
				this.hasMore = true
				let This = this
				let ret =[]
				// 获取歌曲数据
				This.http.search(This.query,This.page).then((res)=>{
					if (!res.data.result.songs) {
			          This.haveMore = false
			          return
			        }
			        let list = res.data.result.songs
			        list.forEach((item) => {
			        	let listItem =createSearchSong(item)
			        	This.http.getSongDetail(listItem.id).then((res)=>{
							let id = listItem.id
							listItem.picUrl = res.data.songs[0].al.picUrl
						})
			           ret.push(listItem)
			        })
				})

				This.page += 30
				let arr =[]
			    This.http.suggest(This.query)
			        .then((res) => {
			        	if (res.data.code === 200) {
				          	This.suggest= res.data.result
				          	// ret.concat(This.formatData(This.suggest))
				          	if(This.formatData(This.suggest)){
				          		This.formatData(This.suggest).forEach((item)=>{
					          		ret.unshift(item)
					          	})
				          	}
				          	
			          	}
			        })
			        .catch((err) => {
			          console.log(err)
			        })
			    This.songs = ret
			    // console.log(This.songs)
		        This.$emit('refresh')
			},
			formatData (list) {
				let ret = []
			    let singerData =[]
			    if(list.artists){
			    	list.artists.forEach((item) => {
			          singerData.push({
			            ...item,
			            ...{type: TYPE_SINGER}
			          })
			        })
			        return singerData
			    }
	        	
		    },
		    // 上拉刷新
		    searchMore(){
		    	if(!this.haveMore){return}
		    	if(!this.songs.length){return}
		    	let This = this
		    	This.http.search(This.query,This.page).then((res)=>{
		    		let list = res.data.result.songs
		    		if(!res.data.result.songs){
		    			This.haveMore = false
		    			return
		    		}
		    		let ret = []
		    		list.forEach((item) => {
			        ret.push(createSearchSong(item))
			        })
			        this.songs = this.songs.concat(ret)
			        this.$emit('refresh')
			        this.page += 30
		    	})
		    },
		    // 点击加载详情
			selectItem(item){
				let This = this
				if(!item.type){
					getSongmsg(item.id).then((res)=>{
						if(res.code === 200){
							let id = item.id
							This.songs.forEach((item)=>{
								if(item.id === id){
									item.musicUrl = res.data[0].url
									This.insertSong(item)
									
								}
							})
						}
						
		            })
					// This.http.getMusicUrl(item.id).then((res)=>{
					// 	let id = item.id
					// 	This.songs.forEach((item)=>{
					// 		if(item.id === id){
					// 			item.musicUrl = res.data.data[0].url
					// 			This.insertSong(item)
					// 		}
					// 	})
					// })
				}else{
					const singer = new Singer({
						id:item.id,
						name:item.name,
						picUrl: item.picUrl
					})
					this.$router.push({
						path:`/search/${item.id}`
					})
					this.setSinger(singer)
				}
				This.$emit('select')
			},
			// 手机键盘控制
			listScroll(){
				this.$emit('listScroll')
			},
			// 刷新scroll
			refresh() {
		        this.$refs.suggest.refresh()
		    },
			...mapMutations({
      			setSinger: 'SET_SINGER',
      			setMusicList: 'SET_MUSIC_LIST'
      		}),
			...mapActions([
		      'insertSong'
		    ])
		},
		watch: {
		    query (val) {
		      if (val === '') {
		        this.suggest = {}
		        this.songs = []
		        this.haveMore = false
		        return
		      }
		      this.suggest = {}
		      this.songs = []
		      this.searchShow = true
		      this.page = 0
		      this.haveMore = true
		      this.getSuggest()
		    }
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>