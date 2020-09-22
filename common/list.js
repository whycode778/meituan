
// 公用登录
var login = function(user){
	return new Promise((resolve,reject)=>{
			console.log(user)
			var db = wx.cloud.database()
			var users = db.collection('user')
			users.add({
			      data: user
			    })
			    .then((res)=>{
			      resolve(res)
			    })
			    .catch((Error)=>{
			      reject(Error)
			    })
	})
}

export {preview,addressdata,login}
