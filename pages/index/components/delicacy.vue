<template>
	<view>
		<!-- 置顶 -->
		<view class="prefer-posi">
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple()">
					<text>{{synthesize}}</text>
					<image src="../../../static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="saLes()">销量高</view>
				<view class="delica-grow" @click="spDed()">速度快</view>
				<view class="delica-grow" @click="unIon()">津贴联盟</view>
				<view class="delica-list delica-right" @click="scReen()">
					<text>筛选</text>
					<image src="../../../static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 综合排序 -->
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item,index) in sortlist" :key="index">
				<text :class="{activeb: index == num}" @click="sortClick(index,item.name,item.screen,item.nums)">{{item.name}}</text>
				</block>
			</view>
			<!-- 筛选 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选 -->
				<block v-for="(item,index) in screendata" :key="index">
				<view>
					<view class="sortlist-title">{{item.title}}</view>
					<view class="sortlist-flex">
						<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
						<text class="Choice" :class="{scractive: itemdata.id == 2}" @click="screenchoIce(indexs,itemdata.sign,itemdata.name)">{{itemdata.name}}</text>
						</block>
					</view>
				</view>
				</block>
				<!-- 单选 -->
				<block v-for="(item,index) in person" :key="index">
				<view>
					<view class="sortlist-title">{{item.title}}</view>
					<view class="sortlist-flex">
						<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
						<text class="Choice" :class="{scractive: indexs == scrnum}" @click="personchoIce(indexs,itemdata.per)">{{itemdata.name}}</text>
						</block>
					</view>
				</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="emPty()">清空</text>
					<text @click="flag && compLete()">完成</text>
				</view>
			</view>
		</view>
		<!-- 阴影 -->
		<view class="yin" v-if="ying" @click="backClic()"></view>
	</view>
</template>

<script>
	// post请求
	import {publicing} from '../../../api/api.js'
	// 请求地址
	import {startingurl,multipleurl} from '../../../api/request.js'
	export default{
		data() {
			return {
				// 禁止点击
				flag:true,
				synthesize:'综合排序',
				drop:false,
				sortmen:false,
				ying:false,
				num:0,
				// 多选
				isscractive:-1,
				// 单选
				scrnum:-1,
				// 多选接收对象
				multiobj:{},
				// 单选接收
				capita:'',
				sortlist: [
					{
						"name":"综合排序",
						"screen":"_id",
						"nums":1
					},
					{
						"name":"起送价最低",
						"screen":"delivering",
						"nums":1
					},
					{
						"name":"配送费最低",
						"screen":"physical",
						"nums":1
					},
					{
						"name":"人均高到低",
						"screen":"capita",
						"nums":-1
					},
					{
						"name":"人均低到高",
						"screen":"capita",
						"nums":1
					}
				],
				// 筛选(多选)
				screendata:[
					{
						"title":"商家特色(可多选)",
						"datas":[
							{
								"id":1,
								"sign":'duration',
								"name":'配送最快'
							},
							{
								"id":1,
								"sign":'deliver',
								"name":'0元起送'
							},
							{
								"id":1,
								"sign":'physi',
								"name":'免配送费'
							}
						],
					}		
				],
				// 人均价筛选
				person:[
					{
						"title":"人均价",
						"datas":[
							{
							"name":"20元以下",
							"per":{
								"$lt":20
								},
							},
							{
							"name":"20-40元",
							"per":{
								"$lte":40,
								"$gte":20
								},
							},
							{
							"name":"40元以上",
							"per":{
								"$gt":40
								},
							},
						]
					}
				],
				
			}
		},
		methods:{
			sortClick(index,name,screen,nums){
				this.num = index
				this.synthesize = name
				this.drop = false
				this.sortmen = false
				this.backClic()
				// console.log(name,screen,nums)
				// 查询
				this.starTing(screen,nums)
			},
			
			// 左边综合排序
			starTing(screen,nums){
				let Data = {
					screen,
					nums
					}
				publicing(startingurl,Data)
				.then((res)=>{
					// console.log(res)
					this.$store.commit('screenmuta',res.data)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 综合排序
			multiple(){
				this.drop = true
				this.sortmen = false
				this.backOne()
			},
			// 销量
			saLes(){
				this.pollic()
			},
			// 速度
			spDed(){
				this.pollic()
			},
			// 津贴联盟
			unIon(){
				this.pollic()
			},
			// 筛选
			scReen(){
				this.drop = false
				this.sortmen = true
				this.backOne()
			},
			// 公用隐藏显示
			pollic(){
				this.drop = false
				this.sortmen = false
				this.backClic()
			},
			// 透明背景
			backOne(){
				setTimeout(()=>{
					this.ying = true
				},310)
			},
			backClic(){
				this.ying = false
				this.drop = false
				this.sortmen = false
			},
			
			// 筛选(多选)
			screenchoIce(indexs,sign,name){
				if(this.screendata[0].datas[indexs].id == 1){
					this.screendata[0].datas[indexs].id = 2
					console.log('选中')
					this.$set(this.multiobj,sign,sign)
					console.log(this.multiobj)
				}else{
					this.screendata[0].datas[indexs].id = 1
					console.log('取消')
					this.$delete(this.multiobj,sign);
					console.log(this.multiobj)
				}
				
			},
			// 单选
			personchoIce(index,name){
				// console.log(index)
				// console.log(name)
				if(this.scrnum == index){
					this.scrnum = -1
					console.log('取消')
					this.$delete(this.multiobj,'capita');
					console.log(this.multiobj)
				}else{
					this.scrnum = index
					console.log('选中')
					this.$set(this.multiobj,'capita',name)
					console.log(this.multiobj)
				}
			},
			
			// 清空
			emPty(){
				this.pollic()
				// 多选批量把id改为1
				this.screendata.forEach((item)=>{
					let ab = item.datas.map((items)=>{
							items.id = 1
							return items
					})
					console.log(ab)
				})
				this.multiobj = {}
				this.capita = ''
				console.log(this.multiobj)
				console.log(this.capita)
				// 单选更改
				this.scrnum = -1	
			},
			
			// 完成
			compLete(){
				this.pollic()
				publicing(multipleurl,this.multiobj)
				.then((res)=>{
					console.log(res)
					this.$store.commit('screenmuta',res.data)
				})
				.catch((err)=>{
					console.log(err)
				})
			}
				
			
		},
		
		computed:{
			// 如果未选
			emptyIng(){
				let a = JSON.stringify(this.multiobj)=='{}'
				if(a == true && this.scrnum == -1){
					console.log('未选择')
					this.flag = false
				}else{
					console.log('选择了')
					this.flag = true
				}
			}
			
		}
	}
</script>

<style scoped>
	.yin{background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0;}
	.prefer-posi{position: absolute; left: 0; right: 0;
	width: 100%;
	z-index: 99;}
	.delica-view image{width: 30upx; height: 30upx; display: block;
	}
	.delica-view{font-size: 30upx; display: flex; align-items: center;
	color: #666666;
	height: 70upx;
	padding: 0 15upx;
	background: #FFFFFF;
	} 
	.delica-list{display: flex; align-items: center;}
	.delica-right{justify-content: flex-end; flex-grow: 5;}
	.delica-grow{flex-grow: 1;}
	/* 排序 */
	.sortlist{background: #ffffff;}
	.sortliteltle{}
	.sortliteltle text{
	padding: 0 15upx;
	display: block;
	font-size: 30upx;
	height: 70upx;
	line-height: 70upx;
	border-top: 1rpx solid #ededed;}
	.activeb {
		color: #f89903 !important;
	}
	/* 选择 */
	.sortlist-view{height: 700upx; overflow: hidden;
	overflow-y: scroll;
	position: relative;}
	.sortlist-title{padding: 0 15upx;
	font-size: 30upx;
	height: 60upx;
	line-height: 60upx;}
	.Choice{font-size: 28upx; background: #f8f8f8;
	height: 55upx;
	line-height: 55upx;
	color: #666666;
	width: calc((100% / 3) - 15px) !important;
	margin: 7.5px;
	text-align: center;
	display: block;
	border-radius: 5upx;
	}
	.sortlist-flex{
		display: flex; flex-wrap: wrap;
		align-items: center;
		margin-bottom: 30upx;
	}
	.sortlist-bottom{background: #ffffff; height: 80upx;
	border-top: 1upx solid #e4e4e4;
	display: flex; justify-content: space-around;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;}
	.sortlist-bottom text{flex-grow: 1; height: 80upx;
	line-height: 80upx;
	text-align: center;}
	.sortlist-bottom text:nth-child(1){border-right: 1upx solid #e4e4e4;}
	.sortlist-bottom text:nth-child(2){background: #ffd348;}
	/* 多选 */
	.scractive{background: #fef6df !important; color: #f29909 !important;} 
</style>
