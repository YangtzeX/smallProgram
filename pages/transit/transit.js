// pages/transit/transit.js
const app = getApp()
let that 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    total: 0,
    fullMarks: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let cateId = JSON.parse(options.cateId)
    let title = options.title
    that.setData({
      cateId: cateId,
      title: title
    })
  },
  startClick () { // 开始答题
    wx.navigateTo({
      url: '/pages/Simulation/Simulation?cateId=' + that.data.cateId + '&title=' + that.data.title,
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
    that.getPractice()
  },
  getPractice () { // 获取真题列表
    let urlStr = app.config.apiUrl + 'api/kaoshi/list'
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let params = {
      remember_token: app.globalData.token,
      cate_id: that.data.cateId
    }
    app.server.postRequest(urlStr, params).then((data) => {
      wx.hideLoading()
      console.log(data)
      if (data.length>0) {
        var total = 0 // 总题数
        var fullMarks = 0 // 满分
        let list = []
        let caseList = []
        // 处理案例题数据
        for (let i in data[3].list) {  // 将对象转为数组
          caseList.push(...data[3].list[i])  // 将对象转为数组后成为二维数组,将二维数组扁平化->变为一维数组
        }
        data[3].list = caseList  // 将重组后的数据赋值给之前的案例题
        for (var i = 0; i<data.length;i++) {
          total += data[i].list.length 
          fullMarks += data[i].list.length * data[i].fen 
          let lists = data[i].list 
          list.push(lists)
          that.setData({
            info: data,
            total: total,
            fullMarks: fullMarks,
            list1: [].concat(...list)
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