// pages/vip/vip.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip: false, // 是否是会员
    rechargeIdx: 0,
    renew: false,
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  rechargeClick (e) {
    let vipId = e.currentTarget.dataset.id 
    that.setData({
      rechargeIdx: e.currentTarget.dataset.index,
      vipId: vipId
    })
  },
  renew () {  // 立即续费
    if (app.globalData.platform == 'ios' || app.globalData.platform == 'iOS') { // 判断是否是iOS机型
      wx.showModal({
        title: '提示',
        content: '由于相关规范,iOS功能暂不可用',
        confirmText: '联系客服',
        success (res) {
          console.log(res)
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/my/my',
            })
          }
        }
      })
    } else {
      that.setData({
        renew: true
      })
    }
    
  },
  rechargePay () { // 充值
    if (app.globalData.platform == 'ios' || app.globalData.platform == 'iOS') { // 判断是否是iOS机型
      wx.showModal({
        title: '提示',
        content: '由于相关规范,iOS功能暂不可用',
        confirmText: '联系客服',
        success (res) {
          console.log(res)
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/my/my',
            })
            
          }
        }
      })
    } else {
      if (that.data.errMsg) {
        app.toast(that.data.errMsg)
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/myInfo/myInfo',
          })
        }, 1000);
      } else {
        wx.request({
          url: app.config.apiUrl+'api/wechat/pay', //接口地址
          method:'post',
          data: {
            remember_token: app.globalData.token,
            code: app.globalData.code,
            id: that.data.vipId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            console.log(res.data.data.paySign)
            console.log(res.data)
            if (res) {
              wx.requestPayment({
                nonceStr: res.data.data.nonceStr,  // 随机字符串长度为32位以下
                package: res.data.data.package,  // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
                paySign: res.data.data.paySign,  // 签名
                timeStamp: JSON.stringify(res.data.data.timeStamp),  // 时间戳
                signType: res.data.data.signType,  // 签名算法
                success: function (res) {
                  console.log(res)
                  app.toast('支付成功');
                  // if (that.data.vipId == 1) {
                  //   that.setData({
                  //     vipType: '季卡：'
                  //   })
                  // } else {
                  //   that.setData({
                  //     vipType: '年卡：'
                  //   })
                  // }
                  that.getVip()
                },
                fail: function (res) {
                  console.log(res)
                  return app.toast('支付失败');
                },
                complete: function (res) {
                  if (res.errMsg == 'requestPayment:cancel') return app.toast('取消支付');
                }
              })
            } else {
              console.log('没有数据')
            }
          }
        }) 
      }
    }
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
    that.getVip()
    that.getMemberCard()
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
        that.setData({
          info: data.data  // 获取vip信息
        })
        let vipTime = (data.data.member_valid_time)*1000  // 会员时间
        console.log(data.data.member_valid_time)
        let nowTime = Date.parse(new Date()) // 将当前时间转为时间戳
        if (!data.data.member_valid_time || vipTime < nowTime) {
          that.setData({
            vip: false
          })
        } else {
          that.setData({
            vip: true,
            endDate: data.data.member_valid_time
          })
        }
        // that.getDate(that.data.endDate)
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // console.log('微信登录====' + JSON.stringify(res));
            app.globalData.code = res.code;
          }
        })
      } else {
        that.setData({
          errMsg: data.message
        })
      }
    }).catch((e) => {
      console.log('获取数据错误===' + JSON.stringify(e))
    })
  },
  getMemberCard () {  // 会员卡
    var urlStr = app.config.apiUrl + 'api/member/card'
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
        that.setData({
          memberCard: data.data,  // 获取vip信息
          vipId: data.data[0].id
        })
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // console.log('微信登录====' + JSON.stringify(res));
            app.globalData.code = res.code;
          }
        })
      } else {
        console.log('获取失败')
      }
    }).catch((e) => {
      console.log('获取数据错误===' + JSON.stringify(e))
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
