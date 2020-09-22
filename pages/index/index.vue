<template>
	<view>
	<view class="contenting">
			<Search></Search>
			<Preference :preferdata="preferdata"></Preference>
			<Title></Title>
		<view @click="poll()" :catchtouchmove="true">	
		<Delicacy id="boxFixed" :class="{'is_fixed' : isFixed}"></Delicacy>
		</view>
		<view style="height: 50upx;"></view>
		<Takeout :takeshop="takeshop"></Takeout>
	</view>
	<home-load v-if="efinition"></home-load>
	</view>
</template>

<script>
	// 公用请求
	var {log} = console
	import {mapState} from 'vuex'
	import {listing} from '../../api/api.js'
	// 引进请求地址
	import {getpreferurl,wxshopurl} from '../../api/request.js'
	import Search from './components/search.vue'
	import Preference from './components/preference.vue'
	import Title from './components/title.vue'
	import Delicacy from './components/delicacy.vue'
	import Takeout from './components/takeout.vue'
	export default {
		components:{
			Search,
			Preference,
			Title,
			Delicacy,
			Takeout
		},
		data() {
			return {
				loading:true,
				efinition: true,
				isFixed:false,
				menutop:'',
				rect:'',
				topdata:'',
				preferdata:[],
				takeshop:[]
			}
		},
		onLoad() {
			const query = wx.createSelectorQuery()
			query.select('#boxFixed').boundingClientRect()
			query.exec((res)=>{
			  console.log(res)
			  this.topdata = res[0].top
			  this.menutop = res[0].top
			})
		},
		methods: {
			poll(){
				// 使页面滚动到底部
				wx.pageScrollTo({
				  scrollTop: this.topdata + 2
				})
			},
		
			preference(){
				// 并发批量请求 promise.all
				Promise.all([listing(getpreferurl),listing(wxshopurl)])
				.then((res)=>{
					log(res)
					// 为你优选
					this.preferdata = res[0].data
					// 附近商家
					this.takeshop = res[1].data
					// 取消loading
					this.efinition = false
				})
				.catch((err)=>{
					log(err)
				})
			}
			
		},
		
		mounted() {
			this.preference()
		},
		
		// 监听页面滚动
		onPageScroll(e) {
			this.rect = e.scrollTop
		},
		computed:{
			...mapState(['screendata']),
			// 滑动组件置顶
			namepage(){
				// console.log('执行')
				if(this.rect > this.menutop){
					console.log('置顶了')
					this.isFixed = true
				}else{
					this.isFixed = false
				}
			},
			// 其他页面来的附近商家数据
			count(){
				this.takeshop = this.screendata.screenarr
			}
			
		}
	}
</script>

<style scoped>
	.contenting{margin: 0 15upx;}
	.is_fixed{position: fixed; left: 0; right: 0; top: 0;}
</style>
