<template>
 <!-- 类手机通讯录组件ABCD... -->
    <scroll 
      @scroll = "scroll"
      :listen-scroll="listenScroll"
      :probeType="probeType"
      class="listview" 
      :data="data" 
      ref="listview"
       
    >
        <!-- <ul> -->
          <!-- <li v-for="group in data" class="list-group" ref="listGroup"> -->
            <!-- <h2 class="list-group-title">{{group.title}}</h2> -->
            <ul  class="list-group">
              <li @click="selectItem(item)" v-for="item in data" class="list-group-item">
                <img v-lazy="item.img1v1Url" alt="" class="avatar">
                <span class="name">{{item.name}}</span>
              </li>
            </ul>
          <!-- </li> -->
        <!-- </ul> -->
        <!-- 阻止默认触发touchmove.stop.prevent -->
       <!--  <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
          <ul> -->
            <!--:class="{'current' : currentIndex === index} 绑定高亮让其右侧列表高亮显示  -->
            <!-- <li v-for="(item,index) in shortcutList" 
            class="item" 
            :class="{'current' : currentIndex === index}" 
            :data-index="index
            ">{{item}}</li>
          </ul>
        </div> -->
        <!-- 滚动固定标题 -->
        <!-- v-show="fixedTitle" 根据fixedTitle是否为空显示title -->
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
          <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <div v-show="!data.length" class="loading-container">
          <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'
// 右侧快速入口列表中元素的高度
const ANCHOR_HEIGHT = 18
// 固定标题的高度
const TITLE_HEIGHT = 30

export default {
    created () {
      //供手指触发相关事件使用
      this.touch ={},
      this.listenScroll = true,
      // 高亮列表  
      this.listHeight = []
      this.probeType = 3
    },
    data(){
      return{
        scrollY:-1, // scroll的y轴位置
        currentIndex:0, //当前显示的第几个
        diff:-1 //滚动时下一个标题与固定标题的距离差 如:A-热门
      }
    },
    props: { 
      data:{
        type:Array,
        default:[]
      }
    },
    computed: {
      // 获取右侧快速入口列表
      // shortcutList(){
      //   return this.data.map((group)=>{
      //     return group.title.substr(0,1) //截取title的第一个字符
      //   })
      // },
      // 固定标题
      fixedTitle(){
        // 处理当this.scrollY > 0时显示两个title问题
        if(this.scrollY > 0){
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    components:{
      Scroll,
      Loading
    },
    methods: {
      // 手指触发事件 
      onShortcutTouchStart(e){
        // 获取触发的索引 data-index
        let anchorIndex = getData(e.target,'index')
        let fristTouch = e.touches[0] //获取手指第一位置
        // 记录当前手指位置
        this.touch.anchorIndex = anchorIndex
        this.touch.y1 = fristTouch.pageY
        this._scrollTo(anchorIndex)
      },
      // 移动事件--滚动到位置
      onShortcutTouchMove(e){
        let fristTouch = e.touches[0] //获取手指第一位置
        this.touch.y2 = fristTouch.pageY
        // 获取手指在y轴上的偏移量
        let delta = this.touch.y2 - this.touch.y1
        // 获取移动了几个元素
        let moveEle = delta / ANCHOR_HEIGHT | 0  
        // 获取移动到的位置
        let anchorIndex =parseInt(this.touch.anchorIndex) + moveEle
        this._scrollTo(anchorIndex)
      },
      refresh(){
        this.$refs.listview.refresh()
      },
      scroll(pos){
        // 获取实时滚动位置
        this.scrollY = pos.y
      },
      // 左侧滚动到指定位置封装
      _scrollTo(index){
        // 处理右侧列表上下两处的空白点击
        // index 为null或非0时是不能进行点击
          console.log(index)
        if(!index && index !==0){
          return
        }
        // 处理右侧列表滑动到顶部时高亮显示了最后一个索引问题
        if(index < 0){
          index = 0
        }else if(index > this.listHeight.length -2){
          index = this.listHeight.length -2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0) //0-动画时间
      },
      // 高亮显示事件
      // _calculateHeight(){
      //   this.listHeight = []
      //   // 获取左侧ul下的li列表
      //   const list = this.$refs.listGroup
      //   let height = 0
      //   this.listHeight.push(height)
      //   for(let i=0;i<list.length;i++){
      //     let item = list[i]
      //     height += item.clientHeight 
      //     this.listHeight.push(height)
      //   }
      // },
      // 左侧列表点击事件
      selectItem(item){
        this.$emit('select',item)
      }
      

    },
    watch: {
      // 监听data数组变化了计算scroll的高度
      data(){
        // setTimeout(()=>{
        //   this._calculateHeight()
        // },20)
      },
      // 监听scrollY的变化
      scrollY(newY){
        // 拉倒最顶部时newY大于0
        if(newY > 0){
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        const listHeight = this.listHeight
        for(let i=0;i<listHeight.length-1;i++){
          let height1 = listHeight[i] //下限
          let height2 = listHeight[i+1] //上限 
          // 最后一个 或  -newY在上下限之间
          // 下滑时newY为负值
          if(-newY>=height1 && -newY<height2){
            this.currentIndex = i
            this.diff =  height2+newY 
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限 
        this.currentIndex = this.listHeight.length - 2
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        // 实时变化当满足条件时添加上移效果,减少DOM操作
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

