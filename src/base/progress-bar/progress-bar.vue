<template>
  <!-- 条形进度条显示组件 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16 //进度条小球的宽度
  const transform = prefixStyle('transform')

	export default {
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    created(){
      this.touch = {} //在不同函数中共享
    },
    methods:{
      // 进度变化
      _offset(offsetwidth){
        this.$refs.progress.style.width = `${offsetwidth}px` //进度条变化
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetwidth}px,0,0)`//小圆球变化
      },
      // 进度条触摸开始
      progressTouchStart(e){
        this.touch.initiated = true //初始化
        this.touch.startX = e.touches[0].pageX //第一手指的横向坐标
        this.touch.left = this.$refs.progress.clientWidth //小圆球偏移量
      },
      // 进度条触摸移动
      progressTouchMove(e){
        if(!this.touch.initiated){
          return 
        }
        const deltaX= e.touches[0].pageX - this.touch.startX //纵向偏移量
        const offsetwidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX))
        this._offset(offsetwidth)
      },
      // 进度条触摸结束
      progressTouchEnd(){
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e){
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetwidth = e.pageX - rect.left
        this._offset(offsetwidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      // 运动的进度条
      _triggerPercent(){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      }
    },
    watch:{
      percent(newPercent){
        if(newPercent >0 &&!this.touch.initiated){
          const barWidth = this.$refs.progressBar.clientWidth-progressBtnWidth
          const offsetwidth = newPercent *barWidth
          this._offset(offsetwidth)
        }
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>