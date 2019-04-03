# vue-music

> Vue.js 打造高级实战——音乐 App
>> 项目描述：基于 Vue+ vuex + vue-router + axios +better-scroll + Scss + ES6 等开发一款移动端音乐 WebApp，UI 界面参考了安卓版的qq音乐、flex 布局适配常见移动端。借助网易云音乐的接口实现数据交互。其功能有播放器内核、推荐页面、热榜页面、歌手页面、歌单详情、歌手详情、排行榜详情、搜索页面、播放列表、用户中心 等等。

## 项目树
```
.
├── README.md
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── index.html
├── package.json
├── prod.server.js
├── src
│   ├── App.vue
│   ├── api
│   │   ├── config.js
│   │   ├── index.js
│   │   ├── song.js
│   │   
│   │   
│   │   
│   ├── base
│   │   ├── confirm
│   │   │   └── confirm.vue
│   │   ├── listview
│   │   │   └── listview.vue
│   │   ├── loading
│   │   │   ├── loading.gif
│   │   │   └── loading.vue
│   │   ├── no-result
│   │   │   ├── no-result.vue
│   │   │   ├── no-result@2x.png
│   │   │   └── no-result@3x.png
│   │   ├── progress-bar
│   │   │   └── progress-bar.vue
│   │   ├── progress-circle
│   │   │   └── progress-circle.vue
│   │   ├── scroll
│   │   │   └── scroll.vue
│   │   ├── search-box
│   │   │   └── search-box.vue
│   │   ├── search-list
│   │   │   └── search-list.vue
│   │   ├── slider
│   │   │   └── slider.vue
│   │   ├── song-list
│   │   │   ├── first@2x.png
│   │   │   ├── first@3x.png
│   │   │   ├── second@2x.png
│   │   │   ├── second@3x.png
│   │   │   ├── song-list.vue
│   │   │   ├── third@2x.png
│   │   │   └── third@3x.png
│   │   ├── switches
│   │   │   └── switches.vue
│   │   └── top-tip
│   │       └── top-tip.vue
│   ├── common
│   │   ├── fonts
│   │   │   ├── music-icon.eot
│   │   │   ├── music-icon.svg
│   │   │   ├── music-icon.ttf
│   │   │   └── music-icon.woff
│   │   ├── image
│   │   │   └── default.png
│   │   ├── js
│   │   │   ├── cache.js
│   │   │   ├── config.js
│   │   │   ├── dom.js
│   │   │   ├── jsonp.js
│   │   │   ├── mixin.js
│   │   │   ├── singer.js
│   │   │   ├── song.js
│   │   │   └── util.js
│   │   └── stylus
│   │       ├── base.styl
│   │       ├── icon.styl
│   │       ├── index.styl
│   │       ├── mixin.styl
│   │       ├── reset.styl
│   │       └── variable.styl
│   ├── components
│   │   ├── add-song
│   │   │   └── add-song.vue
│   │   ├── disc
│   │   │   └── disc.vue
│   │   ├── m-header
│   │   │   ├── logo@2x.png
│   │   │   ├── logo@3x.png
│   │   │   └── m-header.vue
│   │   ├── music-list
│   │   │   └── music-list.vue
│   │   ├── player
│   │   │   └── player.vue
│   │   ├── playlist
│   │   │   └── playlist.vue
│   │   ├── rank
│   │   │   └── rank.vue
│   │   ├── recommend
│   │   │   └── recommend.vue
│   │   ├── search
│   │   │   └── search.vue
│   │   ├── singer
│   │   │   └── singer.vue
│   │   ├── singer-detail
│   │   │   └── singer-detail.vue
│   │   ├── suggest
│   │   │   └── suggest.vue
│   │   ├── tab
│   │   │   └── tab.vue
│   │   ├── top-list
│   │   │   └── top-list.vue
│   │   └── user-center
│   │       └── user-center.vue
│   ├── main.js
│   ├── router
│   │   └── index.js
│   └── store
│       ├── actions.js
│       ├── getters.js
│       ├── index.js
│       ├── mutation-types.js
│       ├── mutations.js
│       └── state.js
└── static
    ├── 1.png
    ├── 2.png
    ├── 3.png
    ├── 4.png
    └── 5.png

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

