<template>
	<view>
	<view class="warp" v-show="modaishow">
		<view class="warp-view">
			<view class="warp-text">请登陆后再操作</view>
			<view class="warp-flex">
				<button @click="messcancel()" plain="true">取消</button>
				<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
			</view>
		</view>
	</view>
	<!-- 提示组件 -->
	<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入公用登录js
	import {publicing} from '../api/api.js'
	export default{
		name:'modal',
		components:{
			HMmessages
		},
		data() {
			return {
				modaishow: false
			}
		},
		methods:{
			init(){
			    this.modaishow = true
			},
			messcancel(){
				this.modaishow = false
				console.log('取消')
			},
			// 发起登录
			getUserInfo(event){
				console.log(event)
				this.modaishow = false
				if(event.detail.userInfo){
					console.log(event.detail.userInfo)
					let wxing = event.detail.userInfo
					this.wxCode(wxing.nickName,wxing.avatarUrl)
				}else{ 
					console.log('拒绝登录')
				}
			  },
			
			// 获取code
			wxCode(nickName,avatarUrl){
				wx.login({
					success: (res) => {
						console.log(res)
						let code = res.code
						this.wxLogin(nickName,avatarUrl,code)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			  
			// 向后端发起登录
			wxLogin(nickName,avatarUrl,code){
				let url = 'wxuser/wxlogin'
				// post请求以对象传值
				let userdata = {
					nickName:nickName,
					avatarUrl:avatarUrl,
					code:code 
				}
				publicing(url,userdata)
				.then((res)=>{
					console.log(res)
					if(res.data.msg == 'success'){
						// 存入本地
						uni.setStorageSync('usermen', res.data.datas)
						this.HMmessages.show('登陆成功',{icon:'success',iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
					}
					
				})
				.catch((err)=>{
					console.log(err)
				})
			}  
		}
	}
</script>

<style scoped>
	/* 模态弹窗布局 */
	.warp{position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
	z-index: 9999;}
	.warp-view{width: 500upx;
			height: 200upx;
			background: #FFFFFF;
			margin: auto;
			position: absolute;
			-webkit-position:absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			border-radius: 8upx;
			overflow: hidden;
			}
	.warp-text{text-align: center;
			margin-top: 30upx;
			font-size: 34upx;
			color: #666666;}		
	.warp-flex{ display: flex;
		justify-content: space-around;
		border-top: 1upx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80upx;
		line-height: 80upx;
		-webkit-transform: translateZ(0);}
	.warp-flex button{border: none;
	font-size: 30upx;}						
</style>
