/**
 * 工具方法
 * @authors Your Name (you@example.org)
 * @date    2018-12-11 16:16:50
 * @version $Id$
 */

// 获取随机整数函数
function getRandomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1)+min)
}
// 洗牌函数--随机播放歌曲
export function shuffle(arr) {
	let _arr = arr.slice() //副本
	for (var i = 0; i <_arr.length; i++) {
		let j = getRandomInt(0,i)
		let t = _arr[i]
	 	_arr[i] = _arr[j]
	 	_arr[j] = t
	 } 
	 return _arr           
}
// 节流函数
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}