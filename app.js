// app.js
let config = require('./common/js/config.js')
let server = require('./common/js/server.js')
let that
App({
  window_w: wx.getSystemInfoSync().windowWidth,    // 屏幕宽度
  window_h: wx.getSystemInfoSync().windowHeight,  // 屏幕高度
  config: config,     // 公共配置
  server: server,  // 服务请求相关类
  server: server.init(config),  // 服务请求相关类
  toast: config.toast,
  // onLaunch: function () {
  onLaunch: function () {
    that = this
    // 获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        //导航高
        that.globalData.navHeight = res.statusBarHeight + 46;
        that.globalData.viewHeight = res.windowHeight - 50
        that.globalData.WindowHeight = res.windowHeight + 46
        that.globalData.platform = res.platform  // 判断手机平台(iOS/android)
        // console.log(res.platform)  // devtools->pc ,iOS -> 苹果手机 , android - > 安卓手机
      }, fail(err) {
        console.log(err);
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo // 微信头像相关信息
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          that.clearUserData()
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: null,
    navHeight: wx.getSystemInfoSync()['statusBarHeight'],
    bgHeight: wx.getSystemInfoSync()['statusBarHeight']
  },
  // 登录成功后，设置本地用户信息并保存到全局
  setUserData(userData, isNavigateBack = true) {
    console.log('登录成功保存信息')
    // console.log(userData)
    // 清除页面名称
    that.globalData.prePageName = ''
    // 将用户信息保存到app全局
    // that.globalData.userInfo = userData
    that.globalData.token = userData.token
    that.globalData.storageUserInfo = userData
    // 将用户信息保存到本地
    that.config.storage.setUserData(userData).then((data) => {
      if (isNavigateBack) {
        // wx.navigateBack()
      }
    })
  },
  
  // 获取本地用户信息并保存到全局
  getUserData(url, isToLoginPage = true) {
    // console.log(that.globalData)
    return new Promise((resolve, reject) => {
      // 如果未登录
      if (!that.globalData.storageUserInfo) {
        that.config.storage.getUserData().then((res) => {
          // console.log(res)
          if (res.token) {
            console.log('有token')
            that.globalData.storageUserInfo = res  // 接口获取的用户信息
            // that.globalData.userInfo = res  // 微信头像相关信息
            that.globalData.token = res.token
            resolve(res)
          } else {
            console.log('token失效')
            that.clearUserData()
          }
        }).catch((e) => {
          console.log('本地数据清空')
          that.clearUserData()
          wx.navigateTo({
            url: '/pages/login/login',
          })
        })
      } else {
        resolve(that.globalData.storageUserInfo)
      }
    })
  },
  // 设置本地习题已答题目的正确/错误个数并保存到全局
  setQuestionData (question,isNavigateBack = true) {
    console.log(question)
    that.globalData.storageQuestion = question //  保存到globalData里面
    that.config.storage.setQuestionData(question).then((data) => { // 保存到本地
      if (isNavigateBack) {
        // wx.navigateBack()
      }
    })
  },
  // 获取本地习题已答题目的正确/错误个数并保存到全局
  getQuestionData (url, isToLoginPage = true) {
    console.log(that.globalData)
    return new Promise((resolve, reject) => {
      // 如果未登录
      if (!that.globalData.setQuestionData) {
        that.config.storage.getQuestionData().then((res) => {
          console.log(res)
          if (res) {
          //   console.log('有token')
            that.globalData.setQuestionData = res
          //   that.globalData.userInfo = res
          //   that.globalData.token = res.token
          //   resolve(res)
          } else {
            res = ''
          }
        }).catch((e) => {

        })
      } else {
        resolve(that.globalData.storageUsetQuestionDataserInfo)
      }
    })
  },
  // 清除用户信息
  clearUserData: function () {
    console.log('清除用户信息')
    that.globalData.storageUserInfo = null
    that.globalData.userInfo = null
    that.globalData.storageQuestion = null 
    that.config.storage.setUserData(null)
  },
  // 跳转到登录页面
  toLoginPage: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
    that.globalData.prePageName = 'login'
  }
})