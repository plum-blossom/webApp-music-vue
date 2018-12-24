<template>
	<!-- 播放列表组件 -->
	<transition name="list-fade">
		<div class="playlist" @click="hide" v-show="showFlag">
			<div class="list-wrapper" @click.stop>
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="iconMode" @click="changeMode"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
					</h1> 
				</div>
				<scroll :refreshDelay="refreshDelay" class="list-content" ref="listContent" :data="sequenceList">
					<transition-group name="list" tag="ul">
						<li ref="listItem" class="item" @click="selectItem(item,index)" v-for="(item,index) in sequenceList" :key="index">
							<i class="current" :class="getcurrentIcon(item)"></i>
							<span class="text">{{item.songName}}</span>
							<span class="like">
								<i class="icon-not-favorite"></i>
							</span>
							<span class="delete" @click.stop="deleteOne(item)">
								<i class="icon-delete"></i>
							</span>
						</li>
					</transition-group>
				</scroll>
				<div class="list-operate">
					<div class="add" @click="showAddSong">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span>关闭</span>
				</div>
				
			</div>
			<confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
			<add-song ref="addSong"></add-song>
		</div>
	</transition>	
</template>
<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	import {playMode} from 'common/js/config'
  	import Scroll from 'base/scroll/scroll'
	import Confirm from 'base/confirm/confirm'
	import {playerMixin} from 'common/js/mixin'
	import AddSong from 'components/add-song/add-song'
	export default {
		mixins: [playerMixin],
		data(){
			return {
				showFlag:false,
				refreshDelay:120
			}
		},
		computed:{
			...mapGetters([
				'sequenceList',
				'currentSong',
				'playlist',
				'mode'
			]),
			// 显示播放模式文字
			modeText(){
				return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
			}


		},
		components:{
			Scroll,
			Confirm,
			AddSong 
		},
		methods:{
			show(){
				this.showFlag = true
				setTimeout(()=>{
					this.$refs.listContent.refresh()
					this.scrollToCurrent(this.currentSong)
				},20)
			},
			hide(){
				this.showFlag = false
			},
			// 当前播放歌曲的active样式
			getcurrentIcon(item){
				if(this.currentSong.id === item.id){
					return 'icon-play'
				}
				return ''
			},
			// 播放列表点击事件
			selectItem(item,index){
				if(this.mode === playMode.random){
					// 获取当前列表的id等于播放列表的id时index
					index = this.playlist.findIndex((song)=>{
						return song.id === item.id
					})
				}
				this.setCurrentIndex(index)
				this.setPlayingState(true)
			},
			// 滚动到当前播放歌曲
			scrollToCurrent(current){
				const index = this.sequenceList.findIndex((song)=>{
					return current.id === song.id
				})
				this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
			},
			// 删除播放列表里的歌曲
			deleteOne(item){
				this.deleteSong(item)
				if(!this.playlist.length){
					this.hide()
				}
			},
			// 显示confirm弹窗
			showConfirm(){
				this.$refs.confirm.show()
			},
			// 清空播放列表
			confirmClear(){
				this.deleteSongList()
				this.hide()
			},
			// 显示添加到列表组件
			showAddSong(){
				this.$refs.addSong.show()
			},
			...mapMutations({
				setCurrentIndex:'SET_CURRENT_INDEX',
				setPlayingState:'SET_PLAYING_STATE'
			}),
			...mapActions([
				'deleteSong',
				'deleteSongList'
			])

		},
		watch:{
			// 观测currentSong的变化
			currentSong(newSong,oldSong){
				if(!this.showFlag || newSong===oldSong){return}
				this.scrollToCurrent(newSong)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>