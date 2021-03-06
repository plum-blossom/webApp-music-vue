# vue-music

> Vue.js 打造高级实战——音乐 App
>> 项目描述：基于 Vue+ vuex + vue-router + axios +better-scroll + Scss + ES6 等开发一款移动端音乐 WebApp，UI 界面参考了安卓版的qq音乐、flex 布局适配常见移动端。借助网易云音乐的接口实现数据交互。其功能有播放器内核、推荐页面、热榜页面、歌手页面、歌单详情、歌手详情、排行榜详情、搜索页面、播放列表、用户中心 等等。

## 项目树
```
.

│  .babelrc
│  .editorconfig
│  .eslintignore
│  .eslintrc.js
│  .gitignore
│  .postcssrc.js
│  index.html
│  package-lock.json
│  package.json
│  prod.server.js
│  README.md
│  代码地址-github
│
├─build
│      build.js
│      check-versions.js
│      dev-client.js
│      dev-server.js
│      utils.js
│      vue-loader.conf.js
│      webpack.base.conf.js
│      webpack.dev.conf.js
│      webpack.prod.conf.js
│
├─config
│      dev.env.js
│      index.js
│      prod.env.js
│
├─dist
│  │  index.html
│  │
│  └─static
│      │  1.png
│      │  2.png
│      │  3.png
│      │  4.png
│      │  5.png
│      │  6.png
│      │  7.png
│      │  8.png
│      │  9.png
│      │  music1.png
│      │  music2.png
│      │  music3.png
│      │  music4.png
│      │  music5.png
│      │  music6.png
│      │
│      ├─css
│      │  │  app.ce6c07cb93d04896e3320759d643d484.css
│      │  │  app.ce6c07cb93d04896e3320759d643d484.css.map
│      │  │
│      │  └─static
│      │      ├─fonts
│      │      │      fontawesome-webfont.674f50d.eot
│      │      │      fontawesome-webfont.af7ae50.woff2
│      │      │      fontawesome-webfont.b06871f.ttf
│      │      │      fontawesome-webfont.fee66e7.woff
│      │      │
│      │      └─img
│      │              fontawesome-webfont.912ec66.svg
│      │              logo@2x.5dfde43.png
│      │              logo@3x.c1d3d91.png
│      │              music-icon.8a34857.svg
│      │              no-result@3x.2858208.png
│      │
│      ├─img
│      │      default.d1b9a8a.png
│      │      fontawesome-webfont.912ec66.svg
│      │      logo@2x.5dfde43.png
│      │      logo@3x.c1d3d91.png
│      │      music-icon.1c1933b.svg
│      │      no-result@3x.2858208.png
│      │
│      └─js
│              0.c6251545e0c18de3e43c.js
│              0.c6251545e0c18de3e43c.js.map
│              1.56934f65edf1e8375c62.js
│              1.56934f65edf1e8375c62.js.map
│              2.0f9bbbecb22598d3845d.js
│              2.0f9bbbecb22598d3845d.js.map
│              3.f56d57be7f377468d045.js
│              3.f56d57be7f377468d045.js.map
│              4.3192ce39f2ac39b3beea.js
│              4.3192ce39f2ac39b3beea.js.map
│              5.d476226287082ac6cb4e.js
│              5.d476226287082ac6cb4e.js.map
│              6.06d9ff4ee017c458832b.js
│              6.06d9ff4ee017c458832b.js.map
│              7.6b7f6c95ec52c1e1c3b3.js
│              7.6b7f6c95ec52c1e1c3b3.js.map
│              app.026680bf0b20eefd26ad.js
│              app.026680bf0b20eefd26ad.js.map
│              manifest.9c77891f48f40f7803b1.js
│              manifest.9c77891f48f40f7803b1.js.map
│              vendor.3a3b70605e16f9873677.js
│              vendor.3a3b70605e16f9873677.js.map
│
├─src
│  │  App.vue
│  │  main.js
│  │
│  ├─api
│  │      config.js
│  │      index.js
│  │      song.js
│  │
│  ├─base
│  │  ├─confirm
│  │  │      confirm.vue
│  │  │
│  │  ├─listview
│  │  │      listview.vue
│  │  │
│  │  ├─loading
│  │  │      loading.gif
│  │  │      loading.vue
│  │  │
│  │  ├─no-result
│  │  │      no-result.vue
│  │  │      no-result@2x.png
│  │  │      no-result@3x.png
│  │  │
│  │  ├─progress-bar
│  │  │      progress-bar.vue
│  │  │
│  │  ├─progress-circle
│  │  │      progress-circle.vue
│  │  │
│  │  ├─scroll
│  │  │      scroll.vue
│  │  │
│  │  ├─search-box
│  │  │      search-box.vue
│  │  │
│  │  ├─search-list
│  │  │      search-list.vue
│  │  │
│  │  ├─slider
│  │  │      slider.vue
│  │  │
│  │  ├─song-list
│  │  │      first@2x.png
│  │  │      first@3x.png
│  │  │      second@2x.png
│  │  │      second@3x.png
│  │  │      song-list.vue
│  │  │      third@2x.png
│  │  │      third@3x.png
│  │  │
│  │  ├─switches
│  │  │      switches.vue
│  │  │
│  │  └─top-tip
│  │          top-tip.vue
│  │
│  ├─common
│  │  ├─fonts
│  │  │      music-icon.eot
│  │  │      music-icon.svg
│  │  │      music-icon.ttf
│  │  │      music-icon.woff
│  │  │
│  │  ├─image
│  │  │      default.png
│  │  │
│  │  ├─js
│  │  │      cache.js
│  │  │      config.js
│  │  │      dom.js
│  │  │      jsonp.js
│  │  │      mixin.js
│  │  │      singer.js
│  │  │      song.js
│  │  │      util.js
│  │  │
│  │  └─stylus
│  │          base.styl
│  │          icon.styl
│  │          index.styl
│  │          mixin.styl
│  │          reset.styl
│  │          variable.styl
│  │
│  ├─components
│  │  ├─add-song
│  │  │      add-song.vue
│  │  │
│  │  ├─disc
│  │  │      disc.vue
│  │  │
│  │  ├─m-header
│  │  │      logo@2x.png
│  │  │      logo@3x.png
│  │  │      m-header.vue
│  │  │
│  │  ├─music-list
│  │  │      music-list.vue
│  │  │
│  │  ├─player
│  │  │      player.vue
│  │  │
│  │  ├─playlist
│  │  │      playlist.vue
│  │  │
│  │  ├─rank
│  │  │      rank.vue
│  │  │
│  │  ├─recommend
│  │  │      recommend.vue
│  │  │
│  │  ├─search
│  │  │      search.vue
│  │  │
│  │  ├─singer
│  │  │      singer.vue
│  │  │
│  │  ├─singer-detail
│  │  │      singer-detail.vue
│  │  │
│  │  ├─suggest
│  │  │      suggest.vue
│  │  │
│  │  ├─tab
│  │  │      tab.vue
│  │  │
│  │  ├─top-list
│  │  │      top-list.vue
│  │  │
│  │  └─user-center
│  │          user-center.vue
│  │
│  ├─router
│  │      index.js
│  │
│  └─store
│          actions.js
│          getters.js
│          index.js
│          mutation-types.js
│          mutations.js
│          state.js
│
└─static
        .gitkeep
        1.png
        2.png
        3.png
        4.png
        5.png
        6.png
        7.png
        8.png
        9.png
        music1.png
        music2.png
        music3.png
        music4.png
        music5.png
        music6.png
		

```


## 项目截图

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/1.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/2.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/3.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/4.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/5.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/6.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/7.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/8.png)

![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/9.png)



### 打包为APP
#### 步骤
 1. npm run build 项目打包，打包后有个dist目录  
 2. HBuilder 新建 - 项目 - 选择 5+APP - 创建  
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music1.png)
 3. 将dist目录下的东西替换到新建的项目下  
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music2.png)
 4. 配置 manifest.json  
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music3.png)
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music4.png)
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music5.png)
 5. apk展示图  
 ![image](https://github.com/plum-blossom/webApp-music-vue/blob/master/static/music6.png)
 6. apk下载地址		
 [下载地址](https://service.dcloud.net.cn/build/download/acbb4f40-55dd-11e9-b5d7-d1166c3b9c24) （注意该地址为临时下载地址，只能下载5次）

### 安装与运行

```
git clone https://github.com/plum-blossom/webApp-music-vue.git

cd vue-music

npm install

npm run dev //服务端运行 访问 http://localhost:8080

npm run build 项目打包

感兴趣的童鞋可以来个star
```

