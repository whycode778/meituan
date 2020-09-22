<template>
	<view>
		<view class="warp" v-show="modaishow">
			<view class="warp-view">
				<view class="warp-text">请登陆后再操作</view>
				<view class="warp-flex">
					<button @click="messcancel()" plain="true">取消</button>
					<button plain="true" open-type="getUserInfo" @getuserinfo="GetUserInfo">登录</button>
				</view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		
	</view>
</template>

<script>
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	var {log} = console
	import {publicing} from "@/api/app.js"
	import {wxloginurl} from '@/api/request.js'
	export default {
		components:{HMmessages},
		data() {
			return {
				modaishow: false
			}
		},
		methods: {
			init() {
				this.modaishow = true
			},
			messcancel() {
				this.modaishow = false
			},
			GetUserInfo(e) {
				log(e)
				if(e.detail.userInfo) {
					let wxing = e.detail.userInfo
					this.wxCode(wxing.avatarUrl,wxing.nickName)
				}
			},
			wxCode(avatarUrl,nickName) {
				wx.login({
					success: (res) => {
						log(res)
						let code = res.code
						this.wxLogin(avatarUrl,nickName,code)
					},
					fail:(err) =>{
						log(err)
					}
				})
			},
			wxLogin(avatarUrl,nickName,code) {
				let data = {
					nickName,
					avatarUrl,
					code,
					appid:'wx594da9610417cba2',
					secret:'4be4d369a717b4a1d855e1c738a72281'
					
				}
				publicing(wxloginurl,data)
				.then(res => {
					log(res)
					if(res.statusCode == 200) {
						uni.setStorageSync('userman',res.data.datas)
						let succ = '登录成功'
						let  ico = 'success'
						this.tIps(succ,ico)
						this.modaishow = false
					}
				})
				.catch(err => {
					log(err)
					let succ = '登录失败'
					let  ico = 'success'
					this.tIps(succ,ico)
				})
			},
			tIps(succ,ico){
				this.HMmessages.show(succ,{icon:ico,fontColor:"#ffffff",iconColor:"#ffffff",background:"rgba(102,0,51,0.8)"})
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
			}
		.warp-flex button{border: none;
		font-size: 30upx;}			
</style>
