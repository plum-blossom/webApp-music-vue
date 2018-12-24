<template>
    <!-- 滚动组件 -->
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
// import { setTimeout } from 'timers';
export default {
    props: {
        probeType:{
            tupe:Number,
            default:1 
            // 1-非实时(屏幕滑动超过一定时间后)派发scrool事件
            // 2-实时(屏幕滑动过程中实时的派发scrool事件
            // 3-不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
        },
        click:{
            type:Boolean,
            default:true
        },
        data:{
            type:Array,
            default:null
        },
        // 是否监听scroll滚动事件
        listenScroll:{
            type:Boolean,
            default:false 
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        // 上拉刷新
        pullup:{
            type:Boolean,
            default:false
        },
        beforeScroll:{
            type: Boolean,
            default: false
        }

    },
    mounted () {
        setTimeout(()=>{
            this._initScroll()  
        },this.refreshDelay)
    },
    methods: {
        _initScroll(){
            if(!this.$refs.wrapper){
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper,{
                probeType:this.probeType,
                click:this.click
            })
            if(this.listenScroll){
                let _this = this
                this.scroll.on('scroll', (pos) => {
                   _this.$emit('scroll', pos)
                })
            } 
            // 上拉刷新
            if(this.pullup){
                this.scroll.on('scrollEnd',()=>{
                    if(this.scroll.y <= (this.scroll.maxScrollY +50)){
                        this.$emit('scrollToEnd')
                    }
                })
            }
            // 收起手机键盘
            if(this.beforeScroll){
                this.scroll.on('beforeScrollstart',()=>{
                    this.$emit('beforeScroll')
                })
            }
        },
        enable(){
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable()
        },
        disable(){
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable()
        },
        // 刷新scroll
        refresh(){
             // 代理better-scroll的refresh方法
            this.scroll && this.scroll.refresh()
        },
        scrollTo(){
            //滚动到指定位置
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
        },
        scrollToElement(){
            //滚动到指定元素
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        // 高亮显示当前元素
    },
    watch: {
        data(){
            setTimeout(()=>{
                this.refresh()
            },this.refreshDelay)
        }
    }
}
</script>

