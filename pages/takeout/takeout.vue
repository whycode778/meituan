<template>
	<view>
		<Business :busidata="busidata"></Business>
		<Tabs></Tabs>
		<view class="ordering-sceate">
			<Ordering :class="[hideing === 0 ? 'activeClass' : 'errorClass']" :orderingdata="orderingdata"
			:busidata="busidata"
			></Ordering>
			<Message :class="[hideing === 1 ? 'activeClass' : 'errorClass']"
			:messagedata="messagedata"
			:tabmessage="tabmessage"
			:empty = "empty"
			></Message>
			<Introduce :busidata="busidata"
			:class="[hideing === 2 ? 'activeClass' : 'errorClass']"></Introduce>
		</view>
		<!-- loading -->
		<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {discussurl,shopurl,getdishesurl} from '../../api/request.js'
	import Business from './components/business.vue'
	import Tabs from './components/tabs.vue'
	import Ordering from './components/ordering.vue'
	import Message from './components/message.vue'
	import Introduce from './components/introduce.vue'
	export default{
		components:{
			Business,
			Tabs,
			Ordering,
			Message,
			Introduce
		},
		data() {
			return {
				// 商家唯一标识
				ids:'',
				loading:true,
				efinition:true,
				hideing: 0,
				busidata:{},
				orderingdata:[],
				messagedata:[],
				// 评论为空
				empty:'',
				// 评论分类标签
				tabmessage:[]
			}
		},
		
		methods:{
			// 子组件执行父组件方法{tab切换}
			fatherMethod(index){
				console.log(index)
				this.hideing = index
			},
			
			// 被子组件调用，请求分类留言数据
			messageMethod(item){
				console.log(item)
				if(item == "全部"){
					// 请求所有留言
					let messdata = {
						merchantid:this.ids
					}
					this.classifMess(messdata)
				}else{
					//请求带有分类的留言
					let messdata = {
						merchantid:this.ids,
						classmessage:item
					}
					this.classifMess(messdata)
				}
			},
			
			// 分类请求的留言
			classifMess(messdata){
				// 评论
				publicing(discussurl,messdata)
				.then((res)=>{
					console.log(res)
					// 商家评价
					this.messagedata = res.data
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 请求数据
			takeFun(ids){
				// post请求以对象传值
				let shopdata = { 
					openid:ids
				}
				let dishesdata = {
					openid:ids
				}
				// 评论
				let messdata = {
					merchantid:ids
				}
				// 并发批量请求 promise.all
				Promise.all([publicing(shopurl,shopdata),publicing(getdishesurl,dishesdata),publicing(discussurl,messdata)])
				.then((res)=>{
					console.log(res)
					// 商家介绍
					this.busidata = res[0].data[0]
					// 菜单商品
					this.orderingdata = res[1].data
					// 商家评价
					// 如果没有评价
					if(res[2].data.length === 0){
						this.empty = 'EMPTY'
					}else{
						this.messagedata = res[2].data
						// 1取出评论分类标签
						var messageword = res[2].data.map((item)=>{
							return item.classmessage
						})
						// 2数组去重
						let newarr = Array.from(new Set(messageword))
						// 3数组去空值
						var newArr = newarr.filter(item => item)
						this.tabmessage = ['全部',...newArr]
					}
					
					
					// loading
					this.efinition = false
				})
				.catch((err)=>{
					console.log(err)
				})
			}
		},
		
		// 接收id
		onLoad(e) {
			console.log(e)
			this.ids = e.id
			this.takeFun(e.id)
		}
		
	}
</script>

<style scoped>
	/* 滚动*/
	.activeClass{display: block; overflow-y: auto; height: 100%;}
	.errorClass{display: none;}
	.ordering-sceate{
	position: fixed;
	left: 0;
	right: 0;
	top: 230upx;
	bottom: 0;}
	
</style>
