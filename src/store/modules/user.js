import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    //异步路由和服务器返回的路由数组进行对比计算出的结果
    resultAsyncRoutes: [],
    //最终要展示的全部的路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, resultAsyncRoutes) => {
    //vuex保存了要先显示的异步路由
    state.resultAsyncRoutes = resultAsyncRoutes
    //还得将常量路由、任意路由与算出来的异步路由合并起来 ，才是该角色最终能看到的所有的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    //把这个最终的路由添加到路由器
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  //处理登录的业务
  async login({ commit }, userInfo) {
    //结构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    //注意当前登录的请求使用的是mock的数据，mock成功的code是20000
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //服务器返回的数据包含：用户名name、用户头像avatar、routes（不同的角色应该展示对应的路由、菜单标记）、roles用户角色信息、buttons按钮的信息做按钮权限用的
        const { data } = response
        //vuex存储用户全部的信息
        commit('SET_USERINFO', data)
        // asyncRoutes（已经引入进来了）和data.routes 对比
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
//定义一个函数：两个数组进行对比,计算出最终要显示的异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    //数组中没有这个元素返回的索引值为-1，如果有这个元素，则返回的一定不是-1
    //服务器返回的路由数组中包含哪个异步路由就得展示哪个异步路由（也就是过滤时留下哪个异步路由）
    if (routes.indexOf(item.name) != -1) {
      //递归，判断二级三级...路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

