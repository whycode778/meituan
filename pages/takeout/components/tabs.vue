<template>
	<!-- 点菜 -->
	<view class="ordering">
		<block v-for="(item,index) in order" :key="index">
		<text :class="{activetext:index == num}" @click="menubtn(index,item.name)">{{item}}</text>
		</block>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				num:0,
				order:['点菜','评价','商家'],
			}
		},
		methods:{
			menubtn(index,name){
				this.num = index
				// 用子组件调用父组件方法
				this.$parent.fatherMethod(index)
			},
		}
	}
</script>

<style scoped>
	.ordering{margin: 20upx;
	display: flex;
	}
	.ordering text{
	margin-right: 60upx;
	display: block;
	height: 60upx;
	line-height: 60upx;
	font-size: 33upx;
	color: #666666;}
	.activetext{color: #333333 !important;
	font-weight: bold !important;
	border-bottom: 5upx solid #ffd161;}
</style>
