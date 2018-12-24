<template>
  <!-- 推荐 -->
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <!-- Slider组件 -->
          <slider>
            <div v-for="item in recommends">
              <a :href="item.url">
                <img class="needsclick" :src="item.img" alt="" @load="loadImage">
                </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul v-if="discList.length">
            <li @click="selectItem(item)"  v-for="item in discList" class="item">
              <div class="icon">
                <img v-lazy="item.img" alt="" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" ><i class="fa"></i><span v-html="item.playCount" style="margin-left: 5px;"></span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading> 
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'
import { createNewSong } from 'common/js/song'

import {mapMutations} from 'vuex'
  export default {
    mixins:[playlistMixin],
    data(){
      return{
        // 轮播图数据
        recommends: [],
        discList:[]
      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 获取banner数据
      _getRecommend(){
        let This = this
        This.http.banner().then((res) => {
          if (res.code === 0) {
            let data = res.data.slider
            This.recommends = []
            for (let i = 0; i < data.length; i++) {
              This.recommends.push({
                url: data[i].linkUrl,
                img: data[i].picUrl
              })
            }
          }
        })
      },
      // 获取歌单数据
      _getDiscList(){
        let This = this
        This.http.remdList().then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.result
            for (let i = 0; i < data.length; i++) {
              This.discList.push({
                id: data[i].id,
                name: data[i].name,
                img: data[i].picUrl,
                playCount: data[i].playCount > 10000 ? Math.round(data[i].playCount / 10000) + '万' : Math.round(data[i].playCount)
              })
            }
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      // 解决remmend后加载滑动不到底部
      loadImage(){
        if(!this.checkLoaded){
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      // 底部播放器 不遮盖最后一个列表元素
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh() //刷新scroll
      },
      // 推荐列表点击事件
      selectItem(item){
        // 路由跳转
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        // 设置推荐歌单对象
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc:'SET_DISC' //设置推荐歌单对象
      })
    },

    components: {
      Slider,
      Loading,
      Scroll
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"
   .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
            .desc
              .fa:before
                content: "\F025"
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
