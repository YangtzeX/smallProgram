// pages/wrongList/wrongList.js
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
    percent: 0,  // 进度条
    status: 'normal', // 进度条状态,全部完成为绿色,已答题的进度为蓝色,未答题的进度为灰色,
    tIndex: 0, // 当前第几题
    total: 0, // 一共几道题
    s: [ "A", "B", "C", "D", "E" ],  // 选项
    indicatorDots: true,  // 图片轮播部分
    autoplay: true, // 图片轮播部分
    interval: 5000, // 图片轮播部分
    duration: 1000, // 图片轮播部分
    judge: '',  // 判断
    radius: '',  // 单选
    current: [],  // 多选
    currentKey: [], // 多选key值
    isAnswer: [], // 单选和多选时,展示的答案
    answer_Length: 0, // 多选时正确答案的个数(答题者选对的个数)
    answer_num: 0, // 多选正确答案个数 (标准答案)
    isBottom: true, // 遮罩层的scroll函数只执行一次
    questionOk: 0,  // 正确数
    questionErr: 0,  // 错误数
    actionVisible: !1, // 题目遮罩
    viewHeight: app.globalData.viewHeight, // 答题卡遮罩层高度
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
    console.log(id)
    let isAnswer = e.currentTarget.dataset.value // 用于题目详解中展示我的答案
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        // 往原数组中添加对象
        list[i].addData = {}
        list[i].addData.value = e.detail.value  // 用于已做题目的选择的值
        list[i].addData.isAnswer = isAnswer  // 用于已做题目的选择的值
        list[i].addData.key= key  // 用于已做题目选中值的key,判断是否正确
        list[i].addData.disabled = true // 已做选择后,就不能再次选择
        if (key == 1) {
          that.setData({
            questionOk: that.data.questionOk ,
            questionErr: that.data.questionErr + 1,
            id: id
          })
        } else if ( key==2) {
          that.setData({
            questionOk: that.data.questionOk + 1,
            questionErr: that.data.questionErr
          })
        }
        this.setData({
          radius: e.detail.value,
          list: that.data.list
        });
      }
    }
  },
  judgeChange(e) {  // 判断
    let key = e.currentTarget.dataset.key
    let id = e.currentTarget.dataset.id
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        // 往原数组中添加对象
        list[i].addData = {}
        list[i].addData.value = e.detail.value  // 用于已做题目的选择的值
        list[i].addData.key= key  // 用于已做题目选中值的key,判断是否正确
        list[i].addData.disabled = true // 已做选择后,就不能再次选择
        if (key == 1) {
          that.setData({
            questionOk: that.data.questionOk ,
            questionErr: that.data.questionErr + 1,
            id: id
          })
        } else if ( key==2) {
          that.setData({
            questionOk: that.data.questionOk + 1,
            questionErr: that.data.questionErr
          })
        }
        this.setData({
          judge: e.detail.value,
          list: that.data.list,

        })
      }
    }
    ;
  },
  checkboxChange(t) {  // 多选
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        //  current 用于显示多选当前选中的项,currentKey保存选中值的key,用于判断选中的是否都是正确项
        // bug:  var 后面必须有 ; 结尾不然下面的 -1 === a/b/c 不执行 ********************************
        var e = t.detail, i = void 0 === e ? {} : e, a = this.data.current.indexOf(i.value);
        -1 === a ? this.data.current.push(i.value) : this.data.current.splice(a, 1)
        var extra = t.currentTarget.dataset,f = void 0 === extra ? {} : extra,b = this.data.currentKey.indexOf(f.key);
        -1 == a ? this.data.currentKey.push(f.key) : this.data.currentKey.splice(b, 1)
        var c = this.data.isAnswer.indexOf(f.value);
        -1 == c ? this.data.isAnswer.push(f.value) : this.data.isAnswer.splice(c, 1)
        this.setData({
          current: this.data.current,
          currentKey: this.data.currentKey,
          isAnswer: this.data.isAnswer
        });
      }
    }
  },
  confirmCkick (e) {  // 多选时的确认答案按钮
    let id = e.currentTarget.dataset.id
    that.setData({
      id: id
    })
    // 用于多选,判断选中的key值和正确的key值数是否想等
    that.getDetails(that.data.id).then(resolve => { // 异步操作,先获取题目详情中的正确答案的个数
      if (resolve) {
        let list = that.data.list
        for (var i= 0;i<list.length;i++) {
          if (i == that.data.tIndex) {
            // 往原数组中添加对象
            list[i].addData = {}
            list[i].addData.value = that.data.current  // 用于已做题目的选择的值
            list[i].addData.isAnswer = that.bubbleSort(that.data.isAnswer)  // // 用于题目详解中展示我的答案
            list[i].addData.key= that.data.currentKey  // 用于已做题目选中值的key,判断是否正确
            list[i].addData.disabled = true // 已做选择后,就不能再次选择 
            that.getSameNum(2,list[i].addData.key)  // 多选时获取key值为2的个数,key=2正确,key=1错误
            this.setData({
              list: that.data.list,
              
            });
          }
        }
      }
    }).catch(err => {
      console.log('异步获取错误' + err)
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
    if (processArr.length == that.data.answer_num  && that.data.currentKey.length == that.data.answer_num) { // 回答正确
      that.setData({
        answer_Length: processArr.length,
        questionOk: that.data.questionOk + 1,
        questionErr: that.data.questionErr,
      })
    } else {  // 回答错误
      that.setData({
        answer_Length: processArr.length,
        questionOk: that.data.questionOk ,
        questionErr: that.data.questionErr + 1
      })
    }
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {  // 用于判断答题卡已答题的正确个数,动态更改答题卡已答题的样式
        list[i].addData.answer_Length = that.data.answer_Length // 将答题者选择的答案key值为2的保存到原数组中
        list[i].addData.answer_num = that.data.answer_num // 将正确答案的key值个数保存到数组
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let cateId = JSON.parse(options.cateId)
    let title = options.title  // 标题
    that.setData({
      cateId: cateId,  // 题库分类id(单选/判断/多选)
      viewHeight: app.globalData.viewHeight,  // 答题卡高度
      urlImg: app.config.apiUrl + 'uploads/'  // 题目中含图片的路径
    })
    wx.setNavigationBarTitle({
      title: title // 标题名字
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
  deleteClick (e) {  // 移除题目
    let list = that.data.list
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) { 
        if (list[i].addData) {
          if (list[i].question_type == 2) {
            console.log('多选')
            console.log(list[i].id)
            console.log(list[i].addData.answer_Length)
            console.log(list[i].addData.answer_num)
            if (list[i].addData.answer_Length == list[i].addData.answer_num) {
              console.log('多选正确')
              
              that.setData({
                questionOk: that.data.questionOk - 1
              })
            } else {
              console.log('多选错误')
              that.setData({
                questionErr: that.data.questionErr - 1,
              })
            }
          } else {
            console.log('单选或判断')
            if (list[i].addData.key == 1) {
              console.log('单选或判断错误')
              that.setData({
                questionErr: that.data.questionErr - 1
              })
            } else if (list[i].addData.key == 2) {
              console.log('单选或判断正确')
              that.setData({
                questionOk: that.data.questionOk -1,
              })
            }
          }
          
        }
        // ******这个删除要放在最后,如果删除后再执行上面的判断,则是对下一个数据的判断,因为当前对应的数据已被删除
        list.splice(i,1)  // 这里选择手动删除,是因为前面每答一道题,就往数组中添加一个addData对象,这个对象用于保存答案,显示我的答案的key值,显示已答题的选中项,和禁选状态,如果这里不手动删除,直接在删除接口中获取题目列表数据,所有数据就会更新,前面做了的题添加的addData数据就清空了,为了保存已经做了的题的状态,所以这里手动删除,以达到移除该题后动态获取题目列表数据的效果
        that.setData({
          list: that.data.list,
          total: that.data.list.length,
          actionVisible: false, // 关闭遮罩层
        })
        if (that.data.tIndex  == that.data.total) { // 当在最后一题移除的时候,显示上一个题
          that.setData({ 
            tIndex: that.data.tIndex -1
          })
        }
      }
    }
    that.getError(e.currentTarget.dataset.id)
  },
  // 下一题
  next(e) {
    let that = this
    let datas = e.currentTarget.dataset.data  // 原数组中是否有新加入的数据,如果有,则说明此题已做了选择
    if (!datas) {
      app.toast('请选择答案')
    } else {
      // 题数量与当前题数对比
      if (that.data.tIndex < that.data.total - 1) {
        that.setData({
          tIndex: that.data.tIndex + 1,
          current: [], // 清除上一题选择的值
          currentKey: [],
          isAnswer: []
        })
        // that.getDetails()
      } else {
        app.toast('已经是最后一题')
      }
      let percents = 100 / (that.data.total) // 将总题数转换为100%,平均每份占比
      if (this.data.percent === 100 ) return;  // 进度条  -> 进度条为100%
      this.setData({
        percent:  parseInt((that.data.tIndex + 1)  * percents)  // 下标乘以平均占比->最后一个下标乘以平均占比等于100%
      });
      if (this.data.percent === 100) {
        this.setData({
          status: 'success'
        });
      }
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
    that.getPractice()
  },
  getPractice () { // 获取错题集列表
    let urlStr = app.config.apiUrl + 'api/question/error/list'
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
      if (data.status_code == 'success') {
        that.setData({
          list: data.data,
          total: data.data.length
        })
      } else {
        console.log('数据提交失败')
      }
    }).catch((e) => {
      console.log('获取数据错误===' + JSON.stringify(e))
    })
  },
  getDetails (id) { // 获取真题详情
    return new Promise ((resolve, reject) => {
      let urlStr = app.config.apiUrl + 'api/question/detail'
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      let params = {
        remember_token: app.globalData.token,
        id: id // 题目id
      }
      app.server.postRequest(urlStr, params).then((data) => {
        wx.hideLoading()
        if (data.status_code == 'success') {
          that.setData({
            // lists: data.data
            answer_num: data.data.answer_num  // 正确个数数
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
  getError(id) {  // 删除错题
    let urlStr = app.config.apiUrl + 'api/question/error/delete'
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let params = {
      remember_token: app.globalData.token,
      id: id  // 题目id
    }
    app.server.postRequest(urlStr, params).then((data) => {
      wx.hideLoading()
      if (data.status_code == 'success') {
        app.toast('移除成功')
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