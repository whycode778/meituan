<template>
	<view>
		<view class="Comment-text">
			<textarea  :placeholder="place"  v-model="Comment" show-confirm-bar="false" focus="true"/>
		</view>
		<!-- 发表按钮 -->
		<view class="published" @click="btnlist && bTn()">
			发表
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view> 
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {commenturl} from '../../api/request.js'
	export default{
		components:{
			HMmessages
		},
		data() {
			return {
				btnlist:true,
				Comment:'',
				place:'',
				shopdata:{},
				userdata:{}
			}
		},
		
		methods:{
			bTn(){
				console.log(this.Comment)
				if(this.Comment == ''){
					let tip = '评论不能为空'
					let icon = 'error'
					this.tips(tip,icon)
					return false
				}
				// 调用接口提交评论
				this.btnlist = false
				this.messAge()
			},
			// 调用接口提交评论
			messAge(){
				// post请求以对象传值
				let data = {
					messages:this.Comment,
					avatarUrl:this.userdata.avatarUrl,
					nickName:this.userdata.nickName,
					openid:this.userdata.openid,
					merchantid:this.shopdata.merchantid
				}
				publicing(commenturl,data)
				.then((res)=>{
					console.log(res)
					let tip = '评论成功'
					this.Comment = ''
					this.btnlist = true
					let icon = 'success'
					this.tips(tip,icon)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		
		onLoad(e) {
			let user = JSON.parse(e.ids)
			console.log(user)
			this.place = '写下你对商家' + user.body + '的评价'
			this.shopdata = user
			// 本地存储的用户信息
			this.userdata = uni.getStorageSync('usermen')
		}
	}
</script>

<style>
	page{background: #F1F1F1;}
	.Comment-text textarea{width: 100%; color: #808080 !important; font-size: 30upx;
							padding: 8upx;}
	.Comment-text{background: #FFFFFF;}
	.published{font-size: 35upx; background: #ffdd00;
				width: 300upx;
				text-align: center;
				margin: 20upx auto;
				padding: 10upx 0;
				border-radius: 10upx;}	
</style>
