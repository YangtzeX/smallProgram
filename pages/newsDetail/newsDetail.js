// pages/newsDetail/newsDetail.js
var WxParse = require('../../common/wxParse/wxParse.js');
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 通知id
    news: "", // 详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let id = JSON.parse(options.id)
    that.setData({
      id: id
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
    that.getNews()
  },
  getNews () {  // 获取通知信息
    wx.showLoading({
      title: '正在加载...',
    });
    var url = app.config.apiUrl + 'api/article/detail';
    var params = {
      id: that.data.id
    }
    app.server.getRequest(url, params).then((data) => {
      wx.hideLoading()
      if (data.status_code === 'success') { 
        that.setData({
          news: data.data
        })
        var contents = data.data.content
        var article = contents
        WxParse.wxParse('article', 'html', article, that, 0)
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