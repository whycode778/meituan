import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const screendata = {
	screenarr:[]
}

// 数据仓库
const state = {
	screendata,
}

export default new Vuex.Store({
	state,
	// 同步操作
	mutations:{
		screenmuta(state,listdata){
			// console.log(listdata)
			state.screendata = {
				screenarr:listdata
			}
		},
	}
})