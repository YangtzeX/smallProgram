// pages/questiontype/questiontype.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    idx: 0, // 真题类型(A/B/C证)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log(options)
    let idx = JSON.parse(options.idx)
    that.setData({
      idx: idx
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  questionClick (e) { // 跳转去答题页面
    let cateId = JSON.stringify(e.currentTarget.dataset.id)
    console.log(e)
    let title = e.currentTarget.dataset.title
    if (e.currentTarget.dataset.title =='单选题') {
      wx.navigateTo({
        url: '/pages/practice/practice?cateId=' + cateId + '&title=' + title, 
      })
    } else {
      //  判断是否是会员
      let vipTime = (app.globalData.storageUserInfo.member_valid_time)*1000  // 会员时间
      // console.log(vipTime)
      let nowTime = Date.parse(new Date()) // 将当前时间转为时间戳
      if (vipTime && vipTime > nowTime) {  // 会员时间不为空,且会员时间大于当前时间
        if (e.currentTarget.dataset.title == '案例题') {
          wx.navigateTo({
            url: '/pages/caseTopic/caseTopic?cateId=' + cateId + '&title=' + title + '&idx=' + that.data.idx, 
          })
        } else {
          wx.navigateTo({
            url: '/pages/practice/practice?cateId=' + cateId + '&title=' + title, 
          })
        }
      } else {
        if (app.globalData.platform == 'ios' || app.globalData.platform == 'iOS') { // 判断是否是iOS机型
          wx.showModal({
            title: '提示',
            content: '由于相关规范,iOS功能暂不可用',
            confirmText: '联系客服',
            success (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/my/my',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '开通会员,开始答题',
            success (res) {
              console.log(res)
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/vip/vip',
                })
              }
            },
            complete (res) {
              console.log(res)
            }
          })
        }
      }
      /*
      if (vipTime && vipTime > nowTime) {  // 会员时间不为空,且会员时间大于当前时间
        if (e.currentTarget.dataset.index === 3) {
          wx.navigateTo({
            url: '/pages/caseTopic/caseTopic?cateId=' + cateId + '&title=' + title + '&idx=' + that.data.idx, 
          })
        } else {
          wx.navigateTo({
            url: '/pages/practice/practice?cateId=' + cateId + '&title=' + title, 
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '开通会员,开始答题',
          success (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/vip/vip',
              })
            }
          }
        })
      }
      */
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.getList()
  },
  getList () { // 获取分类列表
    let urlStr = app.config.apiUrl + 'api/category/list'
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.server.getRequest(urlStr).then((data) => {
      wx.hideLoading()
      if (data.status_code == 'success') {
        if (that.data.idx == 0) {
          that.setData({
            questionList: data.data[0]
          })
        } else if (that.data.idx == 1) {
          that.setData({
            questionList: data.data[1]
          }) 
        }else if (that.data.idx == 2) {
          that.setData({
            questionList: data.data[2]
          }) 
        }
      } else {
        console.log('数据提交失败')
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