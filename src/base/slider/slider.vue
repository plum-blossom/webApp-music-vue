<template>
 <!-- 轮播图组件 -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!-- slot 占坑 插槽-->
      <slot></slot> 
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 移动端 滚动
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom';
  import { setTimeout, clearTimeout } from 'timers';

  export default {
    name:"slider",
    data () {
      return {
        dots :[],
        currentPageIndex:0 //当前图片
      }
    },
    props: {
      loop:{//循环轮播
        type:Boolean,
        default:true
      },
      autoPlay:{//自动轮播
        type:Boolean,
        default:true
      },
      interval:{//轮播间隔
        type:Number,
        default:4000
      }
    },
    mounted () {
      // 20ms延迟
      setTimeout(()=>{
        this._setSliderWidth()//初始化容器宽度
        this._initDots() //初始化圆点
        this._initSlider()//初始化轮播
        // 是否自动播放 
        if(this.autoPlay){
          this._play()
        }
      },20)
      // 监听窗口
      window.addEventListener('resize',()=>{
        if(!this.slider){
          return
        }
        // 不2倍宽度
        this._setSliderWidth(true);
        this.slider.refresh() //重新加载slider
      })
    },
    methods: {
      // 横向滚动设置宽度
      _setSliderWidth(isResize){
        //获取列表元素
        this.children = this.$refs.sliderGroup.children
        let width = 0
        // 获取slider容器宽度
        let sliderWidth  = this.$refs.slider.clientWidth
        // 遍历列表元素为其设置宽度和添加class 
        for(let i=0;i<this.children.length;i++){
          let child =  this.children[i]
          addClass(child,'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if(this.loop && !isResize){
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      //初始化圆点
      _initDots(){
        this.dots = new Array(this.children.length)
      },
      // 初始化轮播
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider,{
          // 轮播配置
          scrollX:true,//是否横向滚动
          scrollY:false,//是否纵向滚动
          momentum:false,//快速滑动时是否开启滑动惯性
          snap:true,//该属性是给slider组件使用，普通的列表滚动不需要配置
          snapLoop:this.loop,//是否无缝轮播
          snapThreshold:0.3,//用手指滑动时页面可切换的属值，大于这个属值可以滑动的下一页
          snapSpeend:400,//轮播图切换的动画时间
          // click:true//是否点击
        }),
        // 滚动结束事件 
        this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX;
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex 
          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play() 
          }
        })
      },
      _play(){
        let pageIndex = this.currentPageIndex + 1
        if(this.loop){
          pageIndex +=1
        }
        this.timer = setTimeout(()=>{
          this.slider.goToPage(pageIndex,0,400)
        },this.interval)
      }
    },
    destroyed () {
      // 组件销毁时清理定时器
      clearTimeout(this.timer)
    }
   
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>