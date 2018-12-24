// 操作和 storage 相关代码

import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEANGTH = 15 //最大搜索量15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 插入数据到数组中 arr-数组 val-存储的值 compare-比较函数(function) maxLen-最大值
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) { //第一条数据
    return
  }
  if (index > 0) {//数组中有这条数据，并且此数据在第一位置
    arr.splice(index, 1) //删除此数据
  }
  arr.unshift(val) //第一位置插入传入的数据
  if (maxLen && arr.length > maxLen) {//判断数组长度
    arr.pop()
  }
}
// 保存搜索数据到缓存
export function saveSearch (query) {
  // 获取 storage
  let searches = storage.get(SEARCH_KEY, [])
  // 调用插入数据到数组函数
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEANGTH)
  // 写入 storage
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 本地缓存读取搜索结果数据
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
// 删除数组的数据
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 本地缓存删除搜索结果数据
export function deleteSearch (query) {
  // 首先获取
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item) => {
    return item === query
  })
  // console.log('delet', searches)

  storage.set(SEARCH_KEY, searches)
  return searches
}
// 清除本地缓存中数据
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
// 保存播放数据
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}
// 加载播放数据数据
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
