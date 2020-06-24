// pages/caseTopic/caseTopic.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],  // 案例题描述
    tId: 0, // 案例题列表id
    tIdArr: [], // 案例id数组
    tIndex: 0, // 当前第几题
    total: 0, // 一共几道题
    s: [ "A", "B", "C", "D", "E" ],  // 选项
    urlImg: '', // 图片路径
    indicatorDots: true,  // 图片轮播部分
    autoplay: true, // 图片轮播部分
    interval: 5000, // 图片轮播部分
    duration: 1000, // 图片轮播部分
    isShow: false,
    judge: '',  // 判断
    radius: '',  // 单选
    totalId: [], // 每点击一下就保存当前题目的id,用于最后查看解析
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let cateId = JSON.parse(options.cateId)
    let title = options.title  // 标题
    let idx = options.idx // 分类(A证/B证/C证)
    that.setData({
      idx: idx,
      cateId: cateId,  // 题库分类id(案例题)
      urlImg: app.config.apiUrl + 'uploads/'  // 题目中含图片的路径
    })
    wx.setNavigationBarTitle({
      title: title // 标题名字
    })
    that.getList().then( resolve => {
      if (resolve) {
        that.getPractice(that.data.tIdArr[that.data.tIndex]).then( resolve => {
          if(resolve) {
            let listLength = that.data.localList
            for (var i = 0; i<listLength.length;i++) {
              that.setData({
                dataLength: listLength[i].length
              })
            }
          }
        })
      }
    })
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
    let index = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    let id = e.currentTarget.dataset.id  // 记录错题和记录答题记录
    let isAnswer = e.currentTarget.dataset.value // 用于题目详解中展示我的答案
    let list = that.data.localList
    for (var i = 0; i<list.length; i++) {
      if (i == that.data.tIndex) { 
        for (var j = 0; j< list[i].length;j++) {
          if (j == index) {
            list[i][j].addData.value = e.detail.value  // 将选择的值保存到新对象中,
            list[i][j].addData.isAnswer = isAnswer  // 用于已做题目的选择的值(我的答案)
            list[i][j].addData.key= key
            that.setData({
              radius: e.detail.value,
              localList: list
            })
            if (that.data.totalId.indexOf(id) == -1) {
              that.data.totalId.push(id)
              that.setData({
                totalId: that.data.totalId
              })
            }
          }
        }
      }
    }
  },
  judgeChange(e) {  // 判断
    let index = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    let id = e.currentTarget.dataset.id  // 记录错题和记录答题记录
    let isAnswer = e.currentTarget.dataset.value // 用于题目详解中展示我的答案
    let list = that.data.localList
    for (var i = 0; i<list.length; i++) {
      if (i == that.data.tIndex) { 
        for (var j = 0; j< list[i].length;j++) {
          if (j == index) {
            list[i][j].addData.value = e.detail.value  // 将选择的值保存到新对象中,
            list[i][j].addData.isAnswer = isAnswer  // 用于已做题目的选择的值(我的答案)
            list[i][j].addData.key= key 
            that.setData({
              judge: e.detail.value,
              localList: list
            })
            if (that.data.totalId.indexOf(id) == -1) {  // 保存id
              that.data.totalId.push(id)
              that.setData({
                totalId: that.data.totalId
              })
            } 
          }
        }
      }
    }
  },
  checkChange(e) {  // 多选
    let index = e.currentTarget.dataset.index
    let list = that.data.localList
    let id =  e.currentTarget.dataset.id
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) {
        for (var j = 0; j < list[i].length;j++) {
          if (j == index) {
            //  current 用于显示多选当前选中的项,currentKey保存选中值的key,用于判断选中的是否都是正确项
            // bug:  var 后面必须有 ; 结尾不然下面的 -1 === a/b/c 不执行 ********************************
            var t = e.detail, a = list[i][j].addData.value.indexOf(t.value);
            -1 === a ? list[i][j].addData.value.push(t.value) : list[i][j].addData.value.splice(a, 1)
            var extra = e.currentTarget.dataset,f = void 0 === extra ? {} : extra,b = list[i][j].addData.key.indexOf(f.key);
            -1 == a ? list[i][j].addData.key.push(f.key) : list[i][j].addData.key.splice(b, 1)
            var c = list[i][j].addData.isAnswer.indexOf(f.value);
            -1 == c ? list[i][j].addData.isAnswer.push(f.value) : list[i][j].addData.isAnswer.splice(c, 1)
            list[i][j].addData.isAnswer = that.bubbleSort(list[i][j].addData.isAnswer)
            list[i][j].addData.key.indexOf("1") == -1 ? list[i][j].addData.answer_length = list[i][j].answer_num : list[i][j].addData.answer_length = 0 // 多选时判断选择的key值中是否有值为1的,有则错误--> 这里的目的是在wxml页面中解析中多选的时候,控制回答正确/错误的显隐和我的答案的颜色
            if (that.data.totalId.indexOf(id) == -1) {
              that.data.totalId.push(id)
              that.setData({
                totalId: that.data.totalId
              })
            } else if (list[i][j].addData.key.length == 0){ // 如果不选,就删除
              that.data.totalId.splice(that.data.totalId.indexOf(id),1)
              that.setData({
                totalId: that.data.totalId
              })
            }
            this.setData({  
              answer_num: list[i][j].answer_num,  // 标准答案长度
              localList: list
            });
          }
        }
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
  confirmCkick () { // 查看解析
    let list = that.data.localList // 题目数据
    for (var i=0;i<list.length;i++) {  // 完成答题后就禁止再次答题
      if (i == that.data.tIndex) {
        //获得对象所有属性的数组 -> 将对象转换成数组
        // Object.getOwnPropertyNames(list[i])
        //获取对象属性的个数
        // Object.getOwnPropertyNames(list[i]).length
        if (list[i].length == that.data.totalId.length ) {
          that.setData({isShow: true}) 
          for (var j = 0; j< list[i].length;j++) {
            list[i][j].addData.disabled = true
            list[i][j].addData.isShow = that.data.totalId.length
          }
        } else {
          app.toast('请先完成本案例所有题目')
        }
      }
    } 
  },
  deleteClick (e) {  // 移除题目
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let list = that.data.localList
    for (var i= 0;i<list.length;i++) {
      if (i == that.data.tIndex) { 
        for (var j = 0; j<list[i].length; j++) {
          if (j == index) {
            new Promise(resolve => {  // 异步执行,先删除,再将删除后的数组进行赋值操作
              list[i].splice(j,1)  // 手动删除,避免已做题目被初始化
              resolve(list[i])
            }).then(res => {
              if (res.length==0) { // 当删除本案例所有的题目后就删除该案例
                that.setData({
                  isShow: false,
                })
              } else {
                for (var k = 0; k<res.length;k++) { // 将移除后剩下的数据进行操作
                  res[k].addData.isShow = res.length
                }
              }
            })
            
          }
        }
        that.setData({
          localList: that.data.localList,
          dataLength: list[i].length,  //  保证在删除当前案例所有题目后,点击下一题不报错 
        })
      }
    }
    that.getError(id)  // 删除错题
  },
  next() { // 下一题
    let that = this
    if (that.data.tIndex < that.data.total - 1) {
      let list = that.data.localList // 题目数据
      for (var i=0;i<list.length;i++) {  // 完成答题后就禁止再次答题
        if (i == that.data.tIndex) {
          if (list[i].length>0) {
            for (var j = 0; j<list[i].length; j++) {
              if (list[i].length == list[i][j].addData.isShow) {  // 判断是否作答完成并有点击查看解析,如果是则跳到下一题,否则弹出提示
                that.setData({
                  tIndex: that.data.tIndex + 1,  // 跳到下一题
                  judge: '',  // 判断
                  radius: '',  // 单选
                })
                wx.pageScrollTo({  // 返回顶部
                  scrollTop: 0,
                  duration: 300
                })
                if (that.data.localList.length < that.data.tIndex + 1) {  // 如果是第一次点击下一题,就加载数据
                  that.getPractice(that.data.tIdArr[that.data.tIndex]).then(resolve => {
                    if (resolve) {
                      that.setData({
                        dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                      })
                    }
                  })  // 获取案例题列表
                  that.setData({
                    isShow: false,
                    totalId: []
                  })
                } else { // 如果已经加载过了再点击下一题就不加载数据 ->目的:避免之前答的题被初始化
                  if (list[i+1].length == 0) {
                    that.setData({
                      isShow: false,
                      dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                    })
                  } else {
                    if (list[i+1].length != list[i+1][0].addData.isShow) { // 如果不是第一次点击下一题,且没有点击查看解析,就不显示解析,只有在答完后,点击上一题,在点击下一题的时候才会显示解析
                      that.setData({
                        isShow: false,
                        dataLength: list[i+1].length
                      })
                    }
                  }
                }
                return
              } else {
                app.toast('请先完成作答并查看解析')
              }
            }
          } else { // 上一题案例数为0时
            that.setData({
              tIndex: that.data.tIndex + 1,  // 跳到下一题
              judge: '',  // 判断
              radius: '',  // 单选
              totalId: [],  // 清除上一题的id数组
            })
            wx.pageScrollTo({  // 返回顶部
              scrollTop: 0,
              duration: 300
            })
            if (that.data.localList.length < that.data.tIndex + 1) {  // 如果是第一次点击下一题,就加载数据
              that.getPractice(that.data.tIdArr[that.data.tIndex]).then(resolve => { // 获取案例题列表
                if (resolve) {
                  that.setData({
                    dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                    isShow: false,
                  })
                }
              })  
            } else { // 如果已经加载过了再点击下一题就不加载数据 ->目的:避免之前答的题被初始化
              if (list[i+1].length == 0) { // 当前题目数为0
                console.log('当前题目数为0')
                that.setData({
                  dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                  isShow: false,
                })
              } else if (list[i+1].length != list[i+1][0].addData.isShow) { // 如果不是第一次点击下一题,且没有点击查看解析,就不显示解析,只有在答完后,点击上一题,在点击下一题的时候才会显示解析
                console.log('没有点击解析')
                that.setData({
                  dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                })
              } else {
                console.log('点击了解析')
                that.setData({
                  isShow:true,
                  dataLength: list[i+1].length,  // 获取当前题目的长度,用于显示
                })
              }
            }
            return
          }
        }
      }
    } else {
      app.toast('已经是最后一题')
    }
  },
  up() { // 上一题
    // 题数量与当前题数对比
    if (this.data.tIndex > 0) {
      // let id = e.currentTarget.dataset.id
      this.setData({
        tIndex: this.data.tIndex - 1,
        isShow: true
      })
      wx.pageScrollTo({  // 返回顶部
        scrollTop: 0,
        duration: 300
      })
      let list = that.data.localList
      for (var i = 0;i<list.length;i++) { 
        if (i == that.data.tIndex) {
          that.setData({
            dataLength: list[i].length // 查看当前案例的题目长度
          })
          if (list[i].length ==0) {
            that.setData({
              isShow:false
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
  getList () { // 获取分类列表
    return new Promise ((resolve, reject) => {
      let urlStr = app.config.apiUrl + 'api/category/list'
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      app.server.getRequest(urlStr).then((data) => {
        wx.hideLoading()
        if (data.status_code == 'success') {  // 获取案例题描述和案例题id
          if (that.data.idx == 0) {  // A证
            that.setData({
              questionList: data.data[0].data[3],
              total: data.data[0].data[3].data.length,  // 获取案例题个数
            })
            for (var i = 0; i<data.data[0].data[3].data.length;i++) { // 将id保存到一个新数组
              that.data.tIdArr.push(data.data[0].data[3].data[i].id)
              that.setData({
                tIdArr: that.data.tIdArr
              })
              
            }
          } else if (that.data.idx == 1) {  // B证案例题
            that.setData({
              questionList: data.data[1].data[3],  
              total: data.data[1].data[3].data.length,
            }) 
            for (var i = 0; i<data.data[1].data[3].data.length;i++) {
              that.data.tIdArr.push(data.data[1].data[3].data[i].id)
              that.setData({
                tIdArr: that.data.tIdArr
              })
            }
          }else if (that.data.idx == 2) {  // C证案例题
            that.setData({
              questionList: data.data[2].data[3],
              total: data.data[2].data[3].data.length,
            }) 
            for (var i = 0; i<data.data[2].data[3].data.length;i++) {
              that.data.tIdArr.push(data.data[2].data[3].data[i].id)
              that.setData({
                tIdArr: that.data.tIdArr
              })
            }
          }
          resolve(data)
        } else {
          console.log('数据提交失败')
        }
      }).catch((e) => {
        console.log('获取数据错误===' + JSON.stringify(e))
      })
    })
  },
  getPractice (tId) { // 获取真题列表
    return new Promise ((resolve, reject) => {
      let urlStr = app.config.apiUrl + 'api/question/error/list'
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      let params = {
        remember_token: app.globalData.token,
        cate_id: tId  // 二级导航案例题列表id
      }
      app.server.postRequest(urlStr, params).then((data) => {
        wx.hideLoading()
        if (data.status_code == 'success') {
          that.setData({
            ['localList[' + (that.data.tIndex ) + ']']:  data.data,
          })
          for (var i= 0; i<data.data.length;i++) {
            data.data[i].addData = {} // 创建一个新对象,保存选择的值
            data.data[i].addData.value = []
            data.data[i].addData.key = []
            data.data[i].addData.isAnswer = []
            data.data[i].addData.disabled = false
            data.data[i].addData.isShow = -1
          }
          // app.setQuestionData(question)  // 保存到本地
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