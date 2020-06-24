// pages/my/my.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: '', // 关于我们
    navlist: [{text:'个人中心',path:'../myInfo/myInfo'},{text:'会员中心',path:'../vip/vip'},{text:'关于我们',path:'../vip/vip'},{text:'安全退出',path:'../vip/vip'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  deepClone (source) {  // 递归深拷贝 
    const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
    for(let keys in source){ // 遍历目标
      if(source.hasOwnProperty(keys)){
        if(source[keys] && typeof source[keys] === 'object'){ // 如果值是对象，就递归一下
          targetObj[keys] = source[keys].constructor === Array ? [] : {};
          targetObj[keys] = deepClone(source[keys]);
        }else{ // 如果不是，就直接赋值
          targetObj[keys] = source[keys];
        }
      }
    }
    return targetObj;
  },
  navClick (e) {
    console.log(e)
    if (JSON.parse(e.target.dataset.index === 0)) {  // 判断是否是个人信息  
      /*
      var info  = that.deepClone(that.data.userInfo)  // 进行深拷贝,在删除info中的token时,userInfo的数据保持不变
      delete info.token  // 由于传递的参数长度太长,无法显示全部信息,导致传递的信息不完整,这里不需要token,就删除掉,不用传递token
      wx.navigateTo({
        url: '/pages/myInfo/myInfo?info=' + JSON.stringify(info)
      })
      */
     wx.navigateTo({
      url: '/pages/myInfo/myInfo'
    })
    } else if (JSON.parse(e.target.dataset.index === 2)) { // 判断是否是关于我们
      // that.setData({
      //   showmodel: true
      // })
      wx.showModal({
        title: '关于我们',
        content: that.data.about.content,
        showCancel: false,
        success (res) {
          if (res.confirm) {
            that.close()
          }
        }
      })
    } else if (JSON.parse(e.target.dataset.index === that.data.navlist.length-1)) { // 判断你是否是安全退出
      wx.showModal({
        title: '提示',
        content: '确定退出?',
        success (res) {
          if (res.confirm) {
          app.clearUserData()
          app.toast('退出成功')
          let setTimeoutObj = setTimeout(() => {
            clearTimeout(setTimeoutObj)
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 500)
          }
        }
      })
    } else if (JSON.parse(e.target.dataset.index ===1)) {
      if (app.globalData.platform == 'ios' || app.globalData.platform == 'iOS') { 
        that.getVip()
      } else {
        wx.navigateTo({
          url: e.target.dataset.path,
        })
      }
    } else {
      wx.navigateTo({
        url: e.target.dataset.path,
      })
    }
  },
  close () {
    console.log('退出登录')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getUserData().then((data) => {
      // console.log(data)
      if (data) {
        that.getInfo()
        // that.setData({
        //   userInfo: data
        // })
      }
      that.getAbout()
    })
  },
  getInfo() { // 获取用户信息,数据更新就重新保存一遍本地缓存
    wx.showLoading({
      title: '正在加载...',
    });
    var url = app.config.apiUrl + 'api/user/index';
    var params = {
      remember_token: app.globalData.token
    }
    
    app.server.postRequest(url, params).then((data) => {
      wx.hideLoading()
      if (data.status_code === 'success') {
        let userInfo = app.globalData.storageUserInfo
        userInfo.real_name = data.data.real_name
        userInfo.user_name = data.data.user_name  // 手机号
        userInfo.member_valid_time = data.data.member_valid_time  // 是否是会员-时间
        userInfo.id = data.data.id  // 用户id
        app.setUserData(userInfo)  // 保存到本地
        that.setData({
          userInfo: userInfo
        })
      } else {
        app.toast('获取失败')
      }
      
    }).catch((e) => {
      console.log('获取数据错误====' + JSON.stringify(e))
    })
  },
  getVip () {  // 获取vip信息
    var urlStr = app.config.apiUrl + 'api/member/index'
    var params = {
      remember_token: app.globalData.token
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.server.postRequest(urlStr, params).then((data) => {
      wx.hideLoading()
      if (data.status_code == 'success') {
        wx.navigateTo({
          url: '/pages/vip/vip',
        })
      } else {
        app.toast(data.message)
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/myInfo/myInfo',
          })
        }, 1000);
      }
    }).catch((e) => {
      console.log('获取数据错误===' + JSON.stringify(e))
    })
  },
  getAbout () {  // 获取关于我们
    wx.showLoading({
      title: '正在加载...',
    });
    var url = app.config.apiUrl + 'api/article/about';
    var params = {
      id: 2
    }
    app.server.getRequest(url, params).then((data) => {
      wx.hideLoading()
      if (data.status_code === 'success') { 
        that.setData({
          about: data.data
        })
      } else {
        console.log('获取失败')
      }
    }).catch((e) => {
      console.log('获取数据错误====' + JSON.stringify(e))
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})