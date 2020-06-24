// pages/myInfo/myInfo.js
const app = getApp();
let that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    pics: '',  // 页面显示的图片
    listImg: [], // 上传到后台的图片路径
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  /* 
  *点击按钮换手机相册或者电脑本地图片
  */
  chooseimage (e) {
    var that = this, pics = this.data.pics
    // ,listImg = that.data.listImg;
    that.setData({
      pics: [],
      listImg: []
    })
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compdatased'], // original 原图，compdatased 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // let pics= []
        let data = {}
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.config.apiUrl + 'api/upload/file', 
            filePath: tempFilePaths[i],
            name: 'file',
            formData: data,
            success: function (res) {
              let datas = JSON.parse(res.data)
              if (datas) {   
                if (that.data.pics.length < 1) {
                  that.data.pics = datas.data.imge_url
                  that.data.listImg = datas.data.image
                  wx.showToast({
                    title: '提交成功',
                    duration: 1000
                  });
                }else {
                  wx.showToast({
                    title: '最多上传1张图片',
                    icon: 'none',
                    duration: 3000
                  });
                } 
                that.setData({
                  pics:that.data.pics,
                  listImg: that.data.listImg
                })
              }
            }
          })
        }
      },
    });
    
  },
  /**
   * 双向绑定
   */
  nickInput(e) { // 昵称
    // console.log(e)
    this.setData({
      'info.nickname': e.detail.value
    })
  },
  nameInput(e) { // 名字
    // console.log(e)
    this.setData({
      'info.real_name': e.detail.value
    })
  },
  phoneInput(e) { // 手机号
    // console.log(e)
    this.setData({
      'info.phone': e.detail.value
    })
  },
  bindClick () {  // 绑定手机号
    wx.navigateTo({
      url: '/pages/bindMobile/bindMobile',
    })
  },
  /**
   * 点击确认按钮获取值
   */
  confirm (e) {
    // if (!that.data.info.nickname) {
    //   app.toast('请输入昵称')
    //   return
    // }
    if (!that.data.info.real_name) {
      app.toast('请输入姓名')
      return
    }
    console.log(app.globalData.userInfo.nickName)
    let urlStr = app.config.apiUrl + 'api/user/edit'
    let params = {
      remember_token: app.globalData.token,
      avatar: that.data.listImg,
      real_name: that.data.info.real_name,
      nickname: that.data.info.nickName
    }
    app.server.postRequest(urlStr, params).then((data) => {
      if (data.status_code === "success") {
        // let userinfo = app.globalData.userInfo
        // userinfo.avatarUrl = that.data.listImg.length>0 ?  that.data.pic : that.data.info.avatarUrl
        that.data.info.avatarUrl =  that.data.pics 
        app.setUserData(that.data.info)
        that.setData({
          info:that.data.info
        })
        app.toast(data.message)
        setTimeout(function(){
          // wx.switchTab({
          //   url: '/pages/my/my',
          // })
          wx.navigateBack({})
        },500)
      }
    }).catch((e) => {
      console.log('登录错误1====' + JSON.stringify(e))
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
      // console.log(data)
      if (data) {
        that.setData({
          info: data,
          pics: that.data.pics ? that.data.pics : app.globalData.storageUserInfo.avatarUrl,
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