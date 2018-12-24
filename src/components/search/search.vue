<template>
	<!-- 搜索组件 -->
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="listenQuery"></search-box>
		</div>
		<div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
			<scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li @click="addQuery(item.k)" class="item" v-for="item in hotkey">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length" >
						<h1 class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					    </h1>
					    <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div class="search-result" ref="searchResult" v-show="query">
			<suggest @listScroll="blurInput" @select="saveSearch" :query="query" ref="suggest"></suggest>
		</div>
		<confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
		<router-view></router-view>
	</div>
</template>

<script>
  	import searchBox from 'base/search-box/search-box'
  	import searchList from 'base/search-list/search-list'
  	import Suggest from 'components/suggest/suggest'
  	import Scroll from 'base/scroll/scroll'
  	import {playlistMixin,searchMixin} from 'common/js/mixin'
  	import {mapActions,mapGetters} from 'vuex'
  	import Confirm from 'base/confirm/confirm'
	export default {
		mixins:[playlistMixin,searchMixin],
		components:{
			Confirm,
			Suggest,
			searchBox,
			searchList,
			Scroll
		},
		data(){
			return {
				hotkey:[]
				// query:''
			}
		},
		created(){
			this.getHotKey()
		},
		computed: {
	      shortcut() {
	        return this.hotkey.concat(this.searchHistory)
	      },
	      // ...mapGetters([
	      // 	'searchHistory' //搜索结果历史数据
	      // ])
	    },
		methods:{
			handlePlaylist(playlist) {
		        const bottom = playlist.length > 0 ? '60px' : ''

		        this.$refs.searchResult.style.bottom = bottom
		        this.$refs.suggest.refresh()

		        this.$refs.shortcutWrapper.style.bottom = bottom
		        this.$refs.shortcut.refresh()
		    },
			getHotKey(){
				let This = this
				This.http.getHotKey().then((res) => {
			        if (res.code === 0) {
			          This.hotkey = res.data.hotkey.slice(0, 10)
			        }
			    })
			},
			// 添加搜索词
			addQuery(query){
				this.$refs.searchBox.setQuery(query)
			},
			// listenQuery(query){
			// 	this.query = query
			// },
			// 保存搜索结果数据
			// saveSearch(){
			// 	this.saveSearchHistory(this.query)
			// },
			// 删除某个历史数据
			// deleteOne(item){
			// 	this.deleteSearchHistory(item)
			// },
			// 显示confirm弹窗
			showConfirm(){
				 this.$refs.confirm.show()
			},
			// 清空历史数据
			// deleteAll(){
			// 	this.clearSearchHistory()
			// },
		    searchMore () {
		      this.$refs.suggest.searchMore()
		    },
		    // blurInput(){
		    // 	this.$refs.searchBox.blur()
		    // },
		    ...mapActions([
		    // 	'saveSearchHistory',//保存搜索的历史数据
		    // 	'deleteSearchHistory',//删除搜索的历史数据
		        'clearSearchHistory'
		    ])
		},
	    watch: {
	      query(newQuery) {
	        if (!newQuery) {
	          setTimeout(() => {
	            this.$refs.shortcut.refresh()
	          }, 20)
	        }
	      }
	    }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>