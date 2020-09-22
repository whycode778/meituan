<template>
	<view>
		<view class="search-cont">
			<view class="search">
				<input type="text"  placeholder-class="inputclass" confirm-type ="search" 
				focus="true"
				placeholder="请输入关键字" 
				v-model="searchdata"
				@confirm="onKeyInput"/>
			</view>
			<view class="search-code" @click="seArch()">
				搜索
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-if="ifhistory">
			<view class="search-title">
				<view>搜索历史</view>
				<view @click="removeStorage()"><image src="../../static/coen/searchend.svg" mode="widthFix"></image></view>
			</view>
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item,index) in setdata" :key="index">
					<view :class="{ activetext: index == num }" @click="menubtn(item)">{{item}}</view>
				</block>
			</view>
		</view>
		
		<!-- 内容展示 -->
		<view v-if="shopcont" class="content-left">
			<block v-for="(item,index) in takeshop" :key="index">
				<view class="content-view" @click="takEout(item.openid)">
					<view class="content-img">
						<image :src="item.logo" mode="aspectFill"></image>
					</view>
					<view class="content-title">
						<text class="conteng-take">{{item.shop}}</text>
						<view class="conteng-monthly">
							<text>月售200</text>
							<text>约{{item.duration}}分钟</text>
						</view>
						<view class="conteng-starting">
							<text>起送¥{{item.delivering}}</text>
							<text>配送¥{{item.physical}}</text>
							<text>人均¥{{item.capita}}</text>
						</view>
						<view class="conteng-starting">
							<image src="../../static/coen/liwu.svg" mode="widthFix"></image>
							<text>{{item.types}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 没有数据的提示 -->
		<tips ref="tips"></tips>
	</view>
</template>

<script>
	// post请求
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {searchurl} from '../../api/request.js'
	// 引入登录模态组件
	import tips from '../../element/tips.vue'
	export default{
		name:'searched',
		components:{
			tips
		},
		data() {
			return {
				searchdata:'',
				// 搜索历史
				setdata:[],
				ifhistory:false,  // 是否有搜索历史
				shopcont:false,
				takeshop:[],  //搜索结果
			}
		},
	
		methods:{
			// 搜索历史
			menubtn(name){
				console.log(name)
				// 发起搜索隐藏搜索历史
				this.ifhistory = false
				// 调用数据库搜索
				this.searchData(name)
			},
			// 键盘的搜索
			onKeyInput(e){
				console.log(e)
				let searchkey = e.detail.value
				if(searchkey != ""){
				// 发起搜索隐藏搜索历史
				this.ifhistory = false
				this.getStorage(searchkey)	
				// 调用数据库搜索
				this.searchData(searchkey)
				}
				
			},
			// 发起搜索
			seArch(){
				console.log(this.searchdata)
				// 存储在本地缓存
				if(this.searchdata != ''){
					// 发起搜索隐藏搜索历史
					this.ifhistory = false
					let searchkey = this.searchdata
					this.getStorage(searchkey)
					// 调用数据库搜索
					this.searchData(searchkey)
				}
			},
			
			// 本地缓存
			getStorage(searchkey){
				let seararray = uni.getStorageSync('search_key') || []
				seararray.unshift(searchkey)
				uni.setStorageSync('search_key', seararray);
			},
			// 取出本地缓存
			setStorage(){
				let setdata = uni.getStorageSync('search_key')
				let setdataarr = Array.from(new Set(setdata))
				
				if(setdataarr == ''){
					this.ifhistory = false
				}else{
					this.setdata = setdataarr
					this.ifhistory = true
				}
				console.log(setdata)
			},
			// 清除缓存
			removeStorage(){
			uni.removeStorageSync('search_key');	
			this.setStorage()
			},
			
			// 请求数据库
			searchData(searchkey){
				// console.log(searchkey)
				let data = {
					searchdata:searchkey
				}
				publicing(searchurl,data)
				.then((res)=>{
					console.log(res)
					if(res.data == '没有商品数据'){
						this.shopcont = false
						let bull = true
						let tips = '没有你要找的商品'
						this.tipsing(bull,tips)
					}else{
						this.shopcont = true
						this.takeshop = res.data
						let bull = false
						let tips = ''
						this.tipsing(bull,tips)
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 提示
			tipsing(bull,tips){
				this.$nextTick(()=>{
					this.$refs.tips.init(bull,tips)
				})
			},
			// 跳转到详情页
			takEout(id){
				wx.navigateTo({
					url:'../takeout/takeout?id=' + id
				})
			}
			
		},
		created() {
			this.setStorage()
		},
		onShareAppMessage(res) {
		    return {
		      title: '美团外卖',
		      path: '/pages/index/index'
		    }
		  },
	}
</script>

<style scoped>
	@import "../../common/meituan.css";
	.content-left{margin: 0 20upx;}
	.search{
	    height: 70upx;
		line-height: 70upx;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
		background:#f8f8f8;
		border-radius: 20upx;
		margin-left: 20upx;
		}
	.search input{
			height: 70upx;
			line-height: 70upx;
	        width: 100%;
	        font-size: 30upx;
			color: #666666; 
			padding-left: 30upx;
			  } 
	.search-cont{display: flex; justify-content: space-between; height: 70upx; align-items: center;
				padding: 30upx 0;
				}
	.search-code{width: 150upx; height: 50upx; text-align: center; font-size: 30upx;}
	/* 搜索历史 */
	.search-history{margin: 20upx;}
	.search-title{font-size: 30upx; font-weight: bold;
				display: flex;
				justify-content:space-between;
				align-items: center;
				height: 60upx;
				line-height: 60upx;}
	.search-title image{width: 36upx; height: 36upx; display: block;}
	.menu-block view {
		background: #f7f8fa;
		border-radius: 6upx;
		font-size: 27upx;
		color: #292c33;
		text-align: center;
		padding: 10upx;
		margin: 20upx 20upx 0 0;
	}
	
	.menu-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
</style>
