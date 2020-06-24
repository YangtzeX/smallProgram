// pages/wrongTopic/wrongTopic.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [
      {id:1,type:1, tip:'每题1分，多选、错选均不得分'},
      {id:2,type:2,tip:'每题1分，多选、错选均不得分'},
      {id:3,type:1,tip:'每题1分，多选、错选均不得分'},
      {id:1,type:1, tip:'每题1分，多选、错选均不得分'},
      {id:2,type:2,tip:'每题1分，多选、错选均不得分'},
      {id:3,type:1,tip:'每题1分，多选、错选均不得分'},
      {id:1,type:1, tip:'每题1分，多选、错选均不得分'}
    ],
    wrongList: [
      {text: 'A证错题',url:'../../images/a_test.png'},
      {text: 'B证错题',url:'../../images/b_test.png'},
      {text: 'C证错题',url:'../../images/c_test.png'}
    ],
    wrongIdx: 0, // 错题集的默认下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  wrongClick (e) { // 点击错题
    that.setData({
      wrongIdx: e.currentTarget.dataset.index
    })
    that.getList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  questionClick (e) { // 跳转去错题答题页面
    let cateId = JSON.stringify(e.currentTarget.dataset.cateid)  // 分类id(单选,判断.多选)
    let title = e.currentTarget.dataset.title
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index == 3) {  // 案例题
      wx.navigateTo({
        url: '/pages/wrongCase/wrongCase?cateId=' + cateId + '&title=' + title +"&idx=" + that.data.wrongIdx,
      })
    } else {
      wx.navigateTo({
        url: '/pages/wrongList/wrongList?cateId=' + cateId + '&title=' + title ,
      })
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
        if (that.data.wrongIdx == 0) {
          that.setData({
            questionList: data.data[0]
          })
        } else if (that.data.wrongIdx == 1) {
          that.setData({
            questionList: data.data[1]
          }) 
        }else if (that.data.wrongIdx == 2) {
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