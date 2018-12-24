<template>
    <!-- 歌手组件 -->
<div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
</div>
</template>
<script>
import Singer from 'common/js/singer' //引入Singer类
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex' //封装mutations
import {playlistMixin} from 'common/js/mixin'

const  HOT_NAME="热门"
const HOT_SINGER_LEN = 10
export default {
    mixins:[playlistMixin],
    data () {
        return {
            singers:[],
            update:0
        }
    },
    created () {
        this._getSingerList()
    },
    methods: {
        _getSingerList(){
            let This = this
          This.http.singerRank()
            .then(function (res) {
              if (res.data.code === 200) {
                let data = res.data
                This.singers = data.list.artists
                This.update = data.list.updateTime
              }
            })
        },
        // 处理数据
        _normalizeSinger(list){
            let map = {
                hot:{//热门数据
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index) => {
                if(index < HOT_SINGER_LEN){
                    map.hot.items.push(new Singer({id:item.Fsinger_mid,name:item.Fsinger_name}))
                }
                const key = item.Findex
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push(new Singer({id:item.Fsinger_mid,name:item.Fsinger_name}))
            });
            // 处理map得到有序列表
            let hot = [] //热门
            let ret = [] //剩余的
            for(let key in map){
                let val =map[key]
                if(val.title.match(/[a-zA-Z]/)){//正则验证
                    ret.push(val)
                }else if(val.title === HOT_NAME){
                    hot.push(val)
                }
            }
            // 排序
            ret.sort((a,b)=>{
                // 比较字符的Unicode 编码
                return a.title.charCodeAt(0) -b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        selectSinger(singer){
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        // 修改state
        ...mapMutations({
            // 对象映射 SET_SINGER来自mutation-types.js
            // 将 `this.setSinger()` 映射为 `this.$store.commit('SET_SINGER')`
            setSinger: 'SET_SINGER' 

        }),
        // 底部播放器 不遮盖最后一个列表元素
        handlePlaylist(playlist){
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh() //刷新scroll
        }
    },
    components: {
        ListView
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>



