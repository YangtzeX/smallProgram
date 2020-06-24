// pages/changePassword/changePassword.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    oldPwd: '', // 旧密码
    pwd: '', // 新密码
    newPwd: '', // 确认新密码
    isPwdInputType1: true,
    isPwdInputType2: true,
    isPwdInputType3: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  passTypechange1() { // 显示原密码，直接取反
    that.setData({
      isPwdInputType1: !that.data.isPwdInputType1
    })
  },
  passTypechange2() { // 显示新密码，直接取反
    that.setData({
      isPwdInputType2: !that.data.isPwdInputType2
    })
  },
  passTypechange3() { // 显示确认信密码，直接取反
    that.setData({
      isPwdInputType3: !that.data.isPwdInputType3
    })
  },
  oldPwdInput(e) { // 旧密码
    that.setData({
      oldPwd: e.detail.value
    });
  },
  pwdInput(e) { // 新密码
    that.setData({
      pwd: e.detail.value
    });
  },
  newPwdInput(e) { // 确认密码
    that.setData({
      newPwd: e.detail.value
    });
  },
  confirmClick () {
    if (!that.data.oldPwd) {
      app.toast('旧密码不能为空')
      return
    } else if (!that.data.pwd) {
      app.toast('新密码不能为空')
      return
    } else if (that.data.pwd.length < 6 ) {
      app.toast('新密码不能少于6位')
      return
    } else if (!that.data.newPwd) {
      app.toast('确认密码不能为空')
      return
    } else if (that.data.pwd !== that.data.newPwd) {
      app.toast('新密码和确认密码不一致')
      return
    }  else {
      console.log('密码格式正确')
    }
    let urlStr = app.config.apiUrl + 'api/user/edit/password'
    let params = {
      remember_token: app.globalData.token,
      password: that.data.oldPwd,
      new_password: that.data.pwd,
      confirm_password: that.data.newPwd
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.server.postRequest(urlStr, params).then((data) => {
      wx.hideLoading()
      if (data.status_code == 'success') {
        app.toast('修改成功')
        let setTimeoutObj = setTimeout(() => {
          clearTimeout(setTimeoutObj)
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 1000)
        return
      } else if (data.status_code == 'fail'){
        // console.log('数据提交失败')
        app.toast('旧密码错误！')
      }
    }).catch((e) => {
      console.log('获取数据错误===' + JSON.stringify(e))
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getUserData().then((data) => {
      if (data) {
        that.setData({
          userInfo: data
        })
      }
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