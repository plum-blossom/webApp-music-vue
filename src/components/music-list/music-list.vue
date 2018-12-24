<template>
	<!-- 详情通用组件 -->
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" >
        <div class="play" v-show="songs.length>0" ref="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
			<div class="filter" ref="filter">
				
			</div>
		</div>
		<div class="bg-layer" ref="layer">
			
		</div>
		<scroll @scroll="scroll" :probeType="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
			<div class="song-list-wrapper">
				<song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
			</div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
		</scroll>
	</div>
</template>
<script>
	import Scroll from 'base/scroll/scroll'
	import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'//引入transform兼容函数
  import Loading from 'base/loading/loading' 
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT  = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

	export default {
    mixins:[playlistMixin],
		props:{
			bgImage:{//背景图
				type:String,
				default:''
			},
			songs:{//歌曲列表
				trpe:Array,
				defalt:[]
			},
			title:{//歌曲标题
				type:String,
				default:''
			},
      rank:{
        type:Boolean,
        default:false
      }
		},
		data(){
      return {
        scrollY: 0
      }
    },
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight //背景图高度
      this.minTranslateY = -this.imageHeight +RESERVED_HEIGHT //滚动列表最小高度
			this.$refs.list.$el.style.top = `${this.imageHeight}px`//背景图高度
		},
		created(){
			this.probeType = 3,
			this.listenScroll = true
		},
		methods:{
			scroll(pos){
        this.scrollY = pos.y //获取滚动y轴的高度
			},
      back(){//返回上级
        this.$router.back()
      },
      selectItem(item,index){
        this.selectPlay({
          list:this.songs,
          index
        })
      },
      // 随机播放全部
      random(){
        this.randomPlay({list:this.songs})
      },
      ...mapActions([
        'selectPlay',//选择播放
        'randomPlay' //随机播放

      ]),
      // 底部播放器 不遮盖最后一个列表元素
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh() //刷新scroll
      }
		},
    watch:{
      scrollY(newY){
        let zIndex = 0 // z-index设置
        let scale = 1 //放大设置
        let blur = 0 //模糊设置
        let translateY = Math.max(this.minTranslateY,newY)//位移最大值
        
        // Math.abs 取得绝对值
        const percent  = Math.abs(newY / this.imageHeight ) //放大倍数
        if(newY >0){
          // 放大图片
          scale =  1+ percent
          zIndex = 10
        }else{
          // 模糊图片
          blur = Math.min(20*percent,20)//最大为20
        }
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        // this.$refs.layer.style.webkitTransform  = `translate3d(0,${translateY}px,0)`
        // 模糊图片-ios
        this.$refs.filter.style[backdrop] = `blur(${blur})px`
        // 让滚动列表刚好停止在标题之下
        if(newY < this.minTranslateY){
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.play.style.display="none"

        }else{
          this.$refs.bgImage.style.paddingTop ='70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.play.style.display="block"

        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] =`scale(${scale})`
        // this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
      }
    },
		components:{
			Scroll,
			SongList,
      Loading
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>