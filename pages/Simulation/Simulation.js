// pages/Simulation/Simulation.js
const app=getApp()
let that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 题目数据
    id: 0, // 题目id
    urlImg: '', // 图片路径
    cateId: 0, // 分类id(单选/多选/判断)
    tIndex: 0, // 当前第几题
    total: 0, // 一共几道题
    s: [ "A", "B", "C", "D", "E" ],  // 选项
    indicatorDots: true,  // 图片轮播部分
    autoplay: true, // 图片轮播部分
    interval: 5000, // 图片轮播部分
    duration: 1000, // 图片轮播部分
    disabled: false,
    // judge: '',  // 判断
    // radius: '',  // 单选
    answer_num: 0, // 多选正确答案个数 (标准答案)
    isBottom: true, // 遮罩层的scroll函数只执行一次
    questionOk: 0,  // 正确数
    score: 0,  // 得分
    actionVisible: !1, // 题目遮罩
    viewHeight: app.globalData.viewHeight, // 答题卡遮罩层高度
    isShow: false,
    countdown: '01:59:59',  // 倒计时
    useTime: '00:00:00',  // 用时
    done: 0,  // 已做
    exist: 0,
  },
  showImage (e) { // 点击预览图片
    var index = e.currentTarget.dataset.index;  // //获取当前图片下标
    var pics = e.currentTarget.dataset.pics; // 获取所有图片
    var showImg = []
    for (var i= 0; i< pics.length; i++) {
      var pic = that.data.urlImg + pics[i]  // 给图片拼接域名,形成完整的图片路径
      showImg.push(pic)  // 将拼接好的地址加入到新的数组中
      that.setData({  // 赋值
        showImg: showImg
      })
    }
    wx.previewImage({
      //当前显示图片
      current: showImg[index],
      //所有图片
      urls: showImg
    })
    
  },
  handleChange(e) {  // 单选
    let key = e.currentTarget.dataset.key
    let id = e.currentTarget.dataset.id
    let isAnswer = e.currentTarget.dataset.value // 用于题目详解中展示我的答案
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        // 往原数组中添加对象
        list[i].addData.value = e.detail.value  // 用于已做题目的选择的值
        list[i].addData.isAnswer = isAnswer  // 用于已做题目的选择的值(我的答案)
        list[i].addData.key= key  // 用于已做题目选中值的key,判断是否正确
        list[i].addData.exist= 1  // 存在,用于答题卡已做题的显隐
        this.setData({
          radius: e.detail.value,
          list: that.data.list
        });
      }
    }
    if(that.data.exist != 0 ) return // 第一次点击就为做了第一题,只执行一次
    that.setData({
      exist: 1,
      done: that.data.done + 1
    }) 
  },
  judgeChange(e) {  // 判断
    let key = e.currentTarget.dataset.key
    let id = e.currentTarget.dataset.id
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        // 往原数组中添加对象
        list[i].addData.value = e.detail.value  // 用于已做题目的选择的值
        list[i].addData.key= key  // 用于已做题目选中值的key,判断是否正确
        list[i].addData.exist= 1  // 存在,用于答题卡已做题的显隐
        this.setData({
          judge: e.detail.value,
          list: that.data.list,
        })
      }
    }
    if(that.data.exist != 0 ) return // 第一次点击就为做了第一题,只执行一次
    that.setData({
      exist: 1,
      done: that.data.done + 1
    })
  },
  checkboxChange(e) {  // 多选
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        //  current 用于显示多选当前选中的项,currentKey保存选中值的key,用于判断选中的是否都是正确项
        // bug:  var 后面必须有 ; 结尾不然下面的 -1 === a/b/c 不执行 ********************************
        var t = e.detail, a = list[i].addData.value.indexOf(t.value);
        -1 === a ? list[i].addData.value.push(t.value) : list[i].addData.value.splice(a, 1)
        var extra = e.currentTarget.dataset,f = void 0 === extra ? {} : extra,b = list[i].addData.key.indexOf(f.key);
        -1 == a ? list[i].addData.key.push(f.key) : list[i].addData.key.splice(b, 1) 
        var c = list[i].addData.isAnswer.indexOf(f.value);
        -1 == c ? list[i].addData.isAnswer.push(f.value) : list[i].addData.isAnswer.splice(c, 1)
        list[i].addData.isAnswer = that.bubbleSort(list[i].addData.isAnswer)
        // list[i].addData.key.indexOf("1") == -1 ? list[i].addData.answer_length = list[i].answer_num : list[i].addData.answer_length = 0 // 多选时判断选择的key值中是否有值为1的,有则错误--> 这里的目的是在wxml页面中解析中多选的时候,控制回答正确/错误的显隐和我的答案的颜色
        that.getSameNum(2,list[i].addData.key)  // 多选时获取key值为2的个数,key=2正确,key=1错误
        list[i].addData.exist=1 // 存在,用于答题卡已做题的显隐
        if (list[i].addData.key.length == 0) {  // 如果在选择之后再全部取消,则该题再次为没做
          list[i].addData.exist=0  // 用Yu答题卡做了之后的颜色(做了为exist=1为蓝色背景,没做为灰色背景)
          that.setData({
            exist: 0,
            done: that.data.done - 1
          })
        } else {
          that.getExist() // 这里使用函数不会受到return的影响
        }
        this.setData({  
          list: list,
        }); 
      }
    }
    
  },
  getExist () { // 多选题时第一次执行
    if(that.data.exist != 0) return // 第一次点击就为做了这一题,只执行一次
    that.setData({
      exist: 1,
      done: that.data.done + 1
    })
  },
  /**
   * 获取数组中相同元素的个数
   * @param val 相同的元素
   * @param arr 传入数组
   */
  getSameNum(val,arr){  // 判断当前题目选中key为2的个数,如果和答案的key为2的个数相等,就回答正确,否则回答错误
    var processArr = arr.filter(function(value) {
      return value == val;
    })
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {  // 用于判断答题卡已答题的正确个数,动态更改答题卡已答题的样式
        list[i].addData.answer_num = processArr.length // 将答题者选择的答案key值为2的保存到原数组中
      }
    }
  },
  bubbleSort(array){  // 多选时,将选择的答案按A,B,C的顺序排列
    var len = array.length;
    for(var i=0;i<len;i++){
      for(var j=i+1;j<len;j++){
        if(array[i]>array[j]){
          var temp = array[j]; //temp用来暂时存储array[j]的值
          array[j]=array[i];
          array[i]=temp;
        }
      }
    }
    return array;
  },
  maskClick: function() { // 打开答题卡
    this.setData({
        actionVisible: !0
    });
  },
  actionCancel: function() { // 关闭答题卡
    this.setData({
      actionVisible: !1
    });
  },
  currentClick (e) {  // 跳转到当前点击的题目
    let index = e.currentTarget.dataset.index
    that.setData({
      tIndex: index,
      actionVisible: !that.data.actionVisible
    })
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        if (list[i].addData.exist == 1) {  // 如果已经做了,就不在重新累加已做题目数
          that.setData({
            exist: 1
          })
        } else {  // 没有做过
          that.setData({
            exist: 0
          })
        }
      }
    }
  },
  confirmCkick () {  // 交卷
    wx.showModal({
      title: '提示',
      content: '确定交卷?',
      success (res) {
        if (res.confirm) {
          that.getSubmit()
        }
      }
    })
  },
  getSubmit () {  // 交卷函数
    that.countDown(that.data.countdown)
    clearInterval(that.data.setTimer) // 清除定时器
    that.setData({
      disabled: true,
      isShow: true,
      actionVisible: true
    })
    let list = that.data.list
    for (var i= 0;i<list.length;i++) { 
      if (!list[i].describe) {  // 不是案例题
        if (list[i].question_type == 1) { // 单选
          if (list[i].addData.key ==2) { // 如果回答正确
            that.data.score += that.data.score1  // 回答正确就加分
            that.setData({
              score : that.data.score,  // 得分
              questionOk : that.data.questionOk + 1  // 正确数
            })
          }
        } else if (list[i].question_type == 3) { // 判断
          if (list[i].addData.key ==2) { // 如果回答正确
            that.data.score += that.data.score3  // 回答正确就加分
            that.setData({
              score : that.data.score,
              questionOk : that.data.questionOk + 1 
            })
          }
        } else if (list[i].question_type == 2) { // 多选
          if (list[i].addData.key.length == list[i].answer_num && list[i].addData.answer_num == list[i].answer_num) {  // 回答正确 : 答题者选择的key值的长度和正确答案长度一样且key=2的长度也和正确答案个数一样
            that.data.score += that.data.score2  // 回答正确就加分
            that.setData({
              score : that.data.score,
              questionOk : that.data.questionOk + 1
            })
          }
        }  
      } else { // 案例题
        if (list[i].question_type == 1) { // 单选
          if (list[i].addData.key ==2) { // 如果回答正确
            that.data.score += that.data.score4  // 回答正确就加分
            that.setData({
              score : that.data.score,
              questionOk : that.data.questionOk + 1
            })
          }
        } else if (list[i].question_type == 3) { // 判断
          if (list[i].addData.key ==2) { // 如果回答正确
            that.data.score += that.data.score4  // 回答正确就加分
            that.setData({
              score : that.data.score,
              questionOk : that.data.questionOk + 1
            })
          }
        } else if (list[i].question_type == 2) { // 多选
          if (list[i].addData.key.length == list[i].answer_num && list[i].addData.answer_num == list[i].answer_num) {  // 回答正确 : 答题者选择的key值的长度和正确答案长度一样且key=2的长度也和正确答案个数一样
            that.data.score += that.data.score4  // 回答正确就加分
            that.setData({
              score : that.data.score,
              questionOk : that.data.questionOk + 1
            })
          }
        } 
      }
    }
  },
  nextTopicClick () {  // 下一套模拟题
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  backClick () { // 返回首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let cateId = JSON.parse(options.cateId)
    let title = options.title
    that.setData({
      cateId: cateId,  // 题库分类id(单选/判断/多选)
      urlImg: app.config.apiUrl + 'uploads/',  // 题目中含图片的路径
      time: Number(that.data.countdown.substring(0, 2)) * 60 * 60 * 2
    })
    wx.setNavigationBarTitle({
      title: title
    })
    // 定时器
    let time = Number(that.data.countdown.substring(0, 2)) * 60 * 60 * 2 // 转为时间戳
    this.data.setTimer = setInterval(() => {
      time = time - 1
      if (time > 0) {
        const hour = parseInt(time / 3600) >= 10 ? parseInt(time / 3600) : '0' + parseInt(time / 3600);
        const minute = parseInt(time % 3600 / 60) >= 10 ?  parseInt(time % 3600 / 60) : '0' +  parseInt(time % 3600 / 60);
        const second = time % 3600 % 60 >= 10 ? time % 3600 % 60 : '0' + time % 3600 % 60;
        that.setData({
          countdown: hour + ":" + minute + ':' + second
        })
      } else {
        clearInterval(that.data.setTimer)
        that.setData({
          setTimer: null,
          countdown: '00:00:00'
        })
        app.toast('答题时间已到,将会自动交卷')
        setTimeout(() => {
          that.getSubmit()  // 调取交卷函数
        }, 2000);
        // wx.reLaunch({
        //   url: '/pages/index/index'
        // })
      }
    }, 1000)
    // 给原题目中添加新对象
    that.getPractice().then( resolve => {
      console.log(resolve)
      if (resolve) {
        let list = that.data.list 
        for (var i = 0,item;item = list[i++];) {
          // item = list[i]
          item.addData = {} // 创建一个新对象,保存选择的值
          item.addData.value = []
          item.addData.key = []
          item.addData.isAnswer = []
        }
      }
    })
  },
  countDown(time) { // 将时分秒转化为时间戳
    var s = 0;
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    that.formatDuring(that.data.time - s)
    return s;
  },
  formatDuring (mss) { // 时间戳的只转为时分秒
    // console.log(mss)
    const hours = parseInt(mss / 3600) >= 10 ? parseInt(mss / 3600) : '0' + parseInt(mss / 3600);
        const minutes = parseInt(mss % 3600 / 60) >= 10 ?  parseInt(mss % 3600 / 60) : '0' +  parseInt(mss % 3600 / 60);
        const seconds = mss % 3600 % 60 >= 10 ? mss % 3600 % 60 : '0' + mss % 3600 % 60;
    that.setData({
      useTime: hours + ":" + minutes + ":" + seconds
    })
    return hours + ":" + minutes + ":" + seconds;
  },
  notDoClick () {  // 未做题目
    that.setData({
      actionVisible: true
    })
  },
  lower(e) {  // 答题卡下拉

  },
  scroll(e) { // 答题卡下拉执行函数
    if(!that.data.isBottom) return 
    that.setData({
      isBottom: false
    })
  },
  // 下一题
  next(e) {
    let that = this
    // 题数量与当前题数对比
    if (that.data.tIndex < that.data.total - 1) {
      that.setData({
        tIndex: that.data.tIndex + 1,
      })
      let list = that.data.list
      for (var i= 0;i<list.length;i++) {
        if (i == that.data.tIndex) {
          if (list[i].addData.exist == 1) {  // 如果已经做了,就不在重新累加已做题目数
            that.setData({
              exist: 1
            })
          } else {  // 没有做过
            that.setData({
              exist: 0
            })
          }
        }
      }
    } else {
      app.toast('已经是最后一题')
    }
    
  },
  // 上一题
  up() {
    // 题数量与当前题数对比
    if (this.data.tIndex > 0) {
      // let id = e.currentTarget.dataset.id
      this.setData({
        tIndex: this.data.tIndex - 1,
      })
      let list = that.data.list
      for (var i= 0;i<list.length;i++) {
        if (i == that.data.tIndex) {
          if (list[i].addData.exist == 1) {  //判断这道题是否已做, 如果已经做了,就不在重新累加已做题目数
            that.setData({
              exist: 1
            })
          } else {  // 没有做过
            that.setData({
              exist: 0
            })
          }
        }
      }
    } else {
      app.toast('已经是第一题');
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
    
  },
  getPractice () { // 获取真题列表
    return new Promise ( (resolve) => {
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
        if (data.length>0) {
          // let cateList = data[3].list
          // cateList.sort(that.sortRule)  
          // console.log(cateList.sort(that.sortRule))
          let caseList = []
          // 处理案例题数据
          for (let i in data[3].list) {  // 将对象转为数组
            caseList.push(...data[3].list[i])  // 将对象转为数组后成为二维数组,将二维数组扁平化->变为一维数组
          }
          that.setData({
            list: data[0].list.concat(data[1].list,data[2].list,caseList.sort(that.sortRule)),
            total: data[0].list.concat(data[1].list,data[2].list,caseList).length,
            score1: data[0].fen,  // 单选题分数
            score2: data[1].fen,  // 多选题分数
            score3: data[2].fen,  // 判断题分数
            score4: data[3].fen,   // 案例题分数 
            sum: data[0].list.length * data[0].fen + data[1].list.length * data[1].fen + data[2].list.length * data[2].fen + caseList.length * data[3].fen  // 总分
          })
          resolve(data)
        } else {
          console.log('数据提交失败')
        }
      }).catch((e) => {
        console.log('获取数据错误===' + JSON.stringify(e))
      })
    })
  },
  sortRule(a,b) {  // 案例题排序:将后台随机抽取的数据把相同案例排在一起
    return a.cate_id - b.cate_id;
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
    wx.reLaunch({
      url: '/pages/index/index'
    })
    clearInterval(that.data.setTimer) // 清除定时器
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