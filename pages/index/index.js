//index.js
//获取应用实例
const app = getApp()
let that
Page({
  data: {
    // text: 'XXXXXXXXXXX',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrl: [],
    urlImg: '', // 图片路径
    news: [], // 通知
    subject: [{text:'A证习题', url: '../../images/a_test.png'},{text:'B证习题', url: '../../images/b_test.png'},{text:'C证习题', url: '../../images/c_test.png'}],
    examinationList: [
      {id:1, text:'主要负责人（A证）模拟考试', fullmark: 100 ,pass: 60},
      {id:2, text:'主要负责人（B证）模拟考试', fullmark: 100 ,pass: 60},
      {id:3, text:'主要负责人（C证）模拟考试', fullmark: 100 ,pass: 60},
    ]
  },
  //事件处理函数
  bindViewTap: function() {

  },
  setContainerHeight () {  // 轮播图

  },
  swiperClick (e) {
    console.log(e)
  },  
  newSClick (e) {  // 通知详情
    console.log(e)
    let nId = JSON.stringify(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail?id=' + nId,
    })
  },
  onLoad: function () {
    that = this
    that.getNews()
    that.getImg()
  },
  onShow: function () {
    app.getUserData().then((data) => {
      // console.log(data)
      if (data) {
        that.getInfo()
        // that.setData({
        //   userInfo: data
        // })
      }
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
  getImg () {  // 获取轮播图
    wx.showLoading({
      title: '正在加载...',
    });
    var url = app.config.apiUrl + 'api/banner/list';
    app.server.getRequest(url).then((data) => {
      wx.hideLoading()
      if (data.status_code === 'success') { 
        that.setData({
          imgUrl: data.data,
          urlImg: app.config.apiUrl + 'uploads/'  // 轮播图路径拼接
        })
      } else {
        console.log('获取失败')
      }
    }).catch((e) => {
      console.log('获取数据错误====' + JSON.stringify(e))
    })
  },
  getNews () {  // 获取通知信息
    wx.showLoading({
      title: '正在加载...',
    });
    var url = app.config.apiUrl + 'api/article/list';
    app.server.getRequest(url).then((data) => {
      wx.hideLoading()
      if (data.status_code === 'success') { 
        that.setData({
          news: data.data.data
        })
      } else {
        console.log('获取失败')
      }
    }).catch((e) => {
      console.log('获取数据错误====' + JSON.stringify(e))
    })
  },
  /**  首页通知动画 -> 现在改成轮播图
   * 
  util (obj) {
    console.log(obj);
    console.log(-obj.list);
    var continueTime = (parseInt(obj.list / obj.container) + 1) * 1500;
    var setIntervalTime = 50 + continueTime;
 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });
    this.animation = animation;
    animation.translateY(obj.container).step({ duration: 50, timingFunction: 'step-start' }).translateY(-obj.list).step({ duration: continueTime });
    this.setData({
      animationData: animation.export()
    })
     setInterval(() => {
       animation.translateY(obj.container).step({ duration: 50, timingFunction: 'step-start' }).translateY(-obj.list).step({ duration: continueTime });
      this.setData({
        animationData: animation.export()
      })
     }, setIntervalTime)
  },
  getHeight() {
    var obj = new Object();
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.notice-item').boundingClientRect()
    query.select('.item-text').boundingClientRect()
    query.exec((res) => {
      obj.container = res[0].height; // 框的height
      obj.list = res[1].height; // list的height
      // return obj;
      this.util(obj);
    })
  },
  */
  
  vipClick () { // vip
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
      wx.navigateTo({
        url: '/pages/vip/vip',
      })
    }
  },
  errorClick () {  // 错题集
    wx.navigateTo({
      url: '/pages/wrongTopic/wrongTopic',
    })
  },
  subjectClick (e) { // 点击题目分类
    let idx = JSON.stringify(e.currentTarget.dataset.index)   // 模拟考试题类型
    wx.navigateTo({
      url: '/pages/questiontype/questiontype?idx=' + idx,
    })
  },
  examClick (e) { // 模拟考试
    let cateId = JSON.stringify(e.currentTarget.dataset.cateid)
    let title = e.currentTarget.dataset.title
    //  判断是否是会员
    let vipTime = (app.globalData.storageUserInfo.member_valid_time)*1000  // 会员时间
    // console.log(vipTime)
    let nowTime = Date.parse(new Date()) // 将当前时间转为时间戳
    if (vipTime && vipTime > nowTime) {  // 会员时间不为空,且会员时间大于当前时间
      wx.navigateTo({
        url: '/pages/transit/transit?cateId=' + cateId + '&title=' + title, 
      })
    } else {
      console.log(app.globalData.platform)
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
          content: '开通会员,开始考试',
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
    

  }
})
