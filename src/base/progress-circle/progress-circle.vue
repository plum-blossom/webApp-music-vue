<template>
	<!-- 圆形进度条显示组件 -->
	<div class="progress-circle">
		<!-- width 和 height 属性可设置此 SVG 文档的宽度和高度。version 属性可定义所使用的 SVG 版本，xmlns 属性可定义 SVG 命名空间 -->
		<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<!-- cx 和 cy 属性定义圆中心的 x 和 y 坐标。如果忽略这两个属性，那么圆点会被设置为 (0, 0)。
			r 属性定义圆的半径
			stroke-dasharray属性用来设置描边的点划线的图案范式。就是设置实线和虚线的宽度。即有或者没有线段的长度。 
			stroke-dashoffset则指定了dash模式到路径开始的距离。
			fill 属性设置形状内的颜色。我们把填充颜色设置为红色 -->
			<circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
			<circle class="progress-bar" r=50 cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
		</svg>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		props:{
			radius:{//宽高
				type:Number,
				default:100
			},
			percent:{//比例
				type:Number,
				default:0
			}
		},
		data(){
			return {
				dashArray: Math.PI  * 100 //Math.PI为圆的周长与直径的比例
			}
		},
		computed:{
			dashOffset(){
				return (1- this.percent) *this.dashArray
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>