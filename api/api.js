// 公用地址
let URL = 'http://localhost:5000/api/'

// 引进错误提示
import {errdata} from 'api/errdata.js'

// get请求
let listing = function(urling){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: urling,
			method: 'GET',
		})
		.then((res)=>{
			console.log(res)
			if(res[1].statusCode == 200){
				resolve(res[1])
			}else{
				let errs = '服务器错误 请稍后再试'
				errdata.errlist(errs)
			}
		})
		.catch((err)=>{
			let errs = '服务器错误 请稍后再试'
			errdata.errlist(errs)
			console.log(err)
			reject(err)
		})
	})
}

// post请求
let publicing = function(urling,shopdata){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: urling,
			method: 'POST',
			data:shopdata
		})
		.then((res)=>{
			if(res[1].statusCode == 200){
				resolve(res[1])
			}else{
				let errs = '服务器错误 请稍后再试'
				errdata.errlist(errs)
			}
		})
		.catch((err)=>{
			let errs = '服务器错误 请稍后再试'
			errdata.errlist(errs)
			reject(err)
		})
	})
}

export{listing,publicing}