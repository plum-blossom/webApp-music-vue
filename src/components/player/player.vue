<template>
  <!-- 播放器 -->
	<div class="player" v-show="playlist.length>0">
		<!-- 展开播放器 -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"> 
  		<div class="normal-player" v-show="fullScreen">
  			<div class="background">
          <img width="100%" height="100%" alt="" :src="currentSong.picUrl">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.songName"></h1>
          <h2 class="subtitle" v-html="currentSong.singerName"></h2>
        </div>
        <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCl">
                <img class="image" alt="" :src="currentSong.picUrl">
              </div>
            </div>
            <!-- 歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric &&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current':currentLineNum ===index}"　v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <!-- 歌词与图片切换 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <!-- 总时长 -->
            <span class="time time-r">{{format(currentSong.duration/1000)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <!-- <div class="icon i-left" :class="disabCls" > -->
            <div class="icon i-left"  :class="disabCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disabCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right"  :class="disabCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" class="icon icon-not-favorite" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
  		</div>
    </transition> 
		<!-- 收起播放器 -->
    <transition name="mini">
  		<div class="mini-player" v-show="!fullScreen" @click="open">
  			<div class="icon">
          <img width="40" height="40" alt="" :class="cdCl" :src="currentSong.picUrl">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songName"></h2>
          <p class="desc" v-html="currentSong.singerName"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
  		</div>
    </transition>
    <playlist  ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.musicUrl" @play="ready" @error="error" @timeupdate="updateTime" @end="songEnd">
    </audio>
    <!-- @play="ready" @error="error" --> 
	</div>
</template>
<script>
  import {mapGetters,mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'  
  //歌词处理插件 
  //API: 播放歌词-play() 暂停歌词-stop() 歌词跳转-seek(startTime) 切换播放/暂停状态-toggelePlay()
  import Lyric from 'lyric-parser' 
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  import {playerMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
	export default {
    mixins: [playerMixin],
    data(){
      return {
        songReady:false, //限制点击次数
        currentTime:0, //当前时间
        radius:32, //svg的宽高
        currentLyric:null, //当前歌词
        currentLineNum:0, //歌词当前行
        playingLyric:'', //播放的歌词
        currentShow:'cd' //歌词显示与否，默认是图片
      }
    },
    created(){
      this.touch = {} 
    },
    components:{
      ProgressBar,
      ProgressCircle, //圆形进度条
      Scroll,
      Playlist
    },
		computed:{
      cdCl(){//旋转图片
        return this.playing ? 'play' : 'play pause'
      },
      playIcon(){//添加播放状态样式
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 播放模式样式设置
      // iconMode(){
      //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      // },
      disabCls(){
        // 添加disableclass
        return this.songReady ? '' : 'disable'
      },
      // 进度条比例
      percent(){
        return this.currentTime / (this.currentSong.duration/1000)
      },
			...mapGetters([
				'fullScreen',//播放器展开状态
        'playing',//播放状态
        'currentIndex'//当前播放索引
        
			])
      
		},
    methods:{
      back(){//收起播放器
        this.setFullScreen(false)
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN'
      }),
      open(){//打开播放器
        this.setFullScreen(true)
      },
      // 引入第三方插件 create-keyframe-animation --使用JavaScript在浏览器中动态生成CSS关键帧动画。
      // transition 动画操作 实现图片移动效果
      //动画enter进入 el-dom元素 done-下一个操作
      enter(el,done){
        const {x,y,scale} = this._getPosAndScale()
        let animation ={
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0,0,0) scale(1.1)`             
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`             
          }
        }
          animations.registerAnimation({
            name:'move',
            animation,
            persets:{
              duration:400,
              easing:'linear'
            }
          })

          animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      //动画进入之后
      afterEnter(el,done){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation =""
      },
      //动画leave
      leave(el,done){
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x,y,scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      //动画leave之后
      afterLeave(el,done){
        this.$refs.cdWrapper.style.transition = ""
        this.$refs.cdWrapper.style[transform] = ""
      },
      // 获取播放器中收缩后的图片位置和展开后的图片位置
      _getPosAndScale(){
        const targetWidth = 40 //收缩后的图片宽度
        const paddingLeft = 40 //收缩后的图片距离左边的距离
        const paddingBottom = 30 //收缩后的图片距离底部的距离
        const paddingTop = 80 //展开后的图片距离顶部的距离
        const width = window.innerWidth * 0.8 // 展开后的图片的宽度（屏幕的宽度的80%）
        const scale= targetWidth / width  //缩放比例
        const x = -(window.innerWidth / 2 - paddingLeft) //x轴移动距离
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom //y轴移动距离
        return {x,y,scale}
      },
      // 播放
      togglePlaying(){
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
        // 暂停时歌词停止,否则，反之
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      // 歌曲结束事件
      songEnd(){
        if(this.mode === playMode.loop){
          this.loop() //循环播放
        }else{
          this.next()
        }
      },
      // 循环播放
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        // 循环播放时，歌词从第一行开始
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      next(){//歌曲前进
        if(!this.songReady){
          return
        }
        // 处理假设歌曲只有一条歌曲，currentSong.id不变，后续不执行
        if(this.playlist.length === 1){
          this.loop()
          return
        }else{
          let index = this.currentIndex + 1
          if(index === this.playlist.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
          this.songReady = false
             

      },
      prev(){//歌曲后退
        if(!this.songReady){
          return
        }
        if(this.playlist.length === 1){
          this.loop()
          return
        }else{
          let index = this.currentIndex - 1
          if(index === -1){
            index = this.playlist.length - 1  
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          } 
        }
          this.songReady = false     
      },
      ready(){
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error(){
        this.songReady = true
      },
      // 获取歌曲播放时长
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      // 格式化时长
      format(interval){
        interval =  interval | 0
        const minute = interval / 60 | 0 //分 取整
        const second = this._pad(interval % 60) //秒 取余
        return `${minute}:${second}` 
      },
      // 计算时间秒 补位 补字符串长度
      _pad(num,n = 2){
        let len = num.toString().length
        while(len <n){
          num = '0' + num
          len ++
        }
        return num
      },
      onProgressBarChange(percent){
        const currentTime = this.currentSong.duration / 1000 * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        // 滑动进度条时歌词跳转到相应的地方
        if(this.currentLyric){
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 改变播放模式
      // changeMode(){
      //   const mode = (this.mode + 1) % 3
      //   // 设置播放模式
      //   this.setPlayMode(mode)
      //   let list =null
      //   if(mode === playMode.random){
      //     list = shuffle(this.sequenceList)
      //   }else{
      //     list = this.sequenceList
      //   }
      //   this.resetCurrentIndex(list)
      //   this.setPlayList(list)
      // },
      // 重置currentIndex 当模式改变时，currentIndex改变来保证currentSong.id不变
      // resetCurrentIndex(list){
      //   let index = list.findIndex((item)=>{
      //     return item.id === this.currentSong.id  //当前歌曲索引
      //   })
      //   this.setCurrentIndex(index)
      // },
      // 获取歌词
      _getLyric(){
        this.currentSong.getLyric().then((lyric)=>{
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric,this.handleLyric)
          if(this.playing){
            this.currentLyric.play()
          }
        }).catch(()=>{
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      // 歌词回调函数 
      handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum
        // 大于5行的让其高亮的歌词显示在正中间
        if(lineNum > 5){
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          // 歌词滚动
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        }else{
          this.$refs.lyricList.scrollTo(0,0,1000)
        }
        this.playingLyric = txt
      },
      // 左右滑动显示对应的图片或歌词
      middleTouchStart(e){
        this.touch.initiated = true //初始化
        // 判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX //第一手指的横向坐标
        this.touch.startY = touch.pageY //第一手指的纵向坐标
      },
      middleTouchMove(e){
        if(!this.touch.initiated){return }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX 
        const deltaY = touch.pageY - this.touch.startY 
        if(Math.abs(deltaY) > Math.abs(deltaX)){return} //纵向不滚动
        if(!this.touch.moved){this.touch.moved = true}
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.middleL.style.opacity = 1- this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd(){
        if(!this.touch.moved){return}
        let offsetWidth
        let opacity
        if(this.currentShow === 'cd'){
          // 从右向左滑
          if(this.touch.percent > 0.1){
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else{
            offsetWidth = 0
            opacity = 1
          }
        }else{
          // 从左向右滑
          if(this.touch.percent <0.9){
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          }else{
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300 //滑动时间
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      // 显示播放列表组件
      showPlaylist(){
        this.$refs.playlist.show()
      },
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch:{
      currentSong(newSong,oldSong){
        // currentSong改变时调audio
        // $nextTick -- 需要在视图更新之后，基于新的视图进行操作
        if(!newSong.id){
          return
        }
        if(newSong.id === oldSong.id){
          return
        }
        // 歌曲改变后歌词与图片模式停止 解决切换歌曲后歌词来回跳动
        if(this.currentLyric){this.currentLyric.stop()}
        // 保证在微信中从后台切到前台，歌曲可以开始重新播放
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.$refs.audio.play()
          this._getLyric()
        },1000)
      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>