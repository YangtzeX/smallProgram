// pages/login/login.js
const app = getApp()
let that
/* 微信登录 */
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
    // this.getlogin()
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

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.showLoading({
      title: '正在授权登录...',
      mask: true
    })
    if (e.detail.rawData) {
      loadOpenId(JSON.parse(e.detail.rawData), true)
    } else {
      app.toast('微信授权失败')
    }
  }
})
function loadOpenId(userData, isWxAuth = false) {
  // 微信登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log('微信登录====' + JSON.stringify(res));
      let urlStr = app.config.apiUrl + 'api/wechat/get/openid'
      console.log(app.config.apiUrl)
      let params = {
        code: res.code
      }
      app.server.postRequest(urlStr, params).then((data) => {
        wx.hideLoading()
        console.log('openid=======' + typeof (data))
        console.log('openid=======' + JSON.stringify(data))
        if (isWxAuth == false) {
          app.toast('登录成功')
          userData.openid = data.data.openid
          // 将用户信息保存
          app.setUserData(userData)
        } else {
          userData.sessionKey = data.data.session_key // 把接口返回到session_key塞进用户信息里面
          loadAuthLogin(data.data.openid, userData)
          console.log(userData)
        }
      }).catch((e) => {
        console.log('获取数据错误====' + JSON.stringify(e))
      })
    }
  })
}
// 微信授权登录保存用户数据
function loadAuthLogin(openId, wxUserData) {
  // console.log('wxUserData====' + JSON.stringify(wxUserData))
  let urlStr = app.config.apiUrl + 'api/login/index'
  let params = {
    openid: openId,
    nickName: wxUserData.nickName,
    gender: wxUserData.gender,
    avatarUrl: wxUserData.avatarUrl
  }
  app.server.postRequest(urlStr, params).then((data) => {
    // console.log(data)
    data.avatarUrl = wxUserData.avatarUrl
    data.wxavatarUrl = wxUserData.avatarUrl
    data.nickName = wxUserData.nickName
    data.gender = wxUserData.gender
    data.sessionKey = wxUserData.sessionKey
    data.token = data.data.remember_token
    data.openId = openId
    delete data.data  // 删除多余的token,这里出现了两次
    // console.log(data)
    getuser(data)
    // 将用户信息保存
  }).catch((e) => {
    console.log('登录错误1====' + JSON.stringify(e))
  })
}
function getuser(userInfo) {
  console.log(userInfo)
  var urlStr = app.config.apiUrl + 'api/user/index'
  var params = {
    remember_token: userInfo.token
  }
  wx.showLoading({
    title: '正在加载',
    mask: true
  })
  app.server.postRequest(urlStr, params).then((data) => {
    wx.hideLoading()
    console.log(data)
    if (data.status_code == 'success') {
      // if (data.data.nickname) {
      //   var nickname = Base64.decode(data.data.nickname)
      //   console.log(nickname)
      // }
      // var userInfo = data.data
      // userInfo.avatar = data.data.avatar
      // userInfo.nickName = data.data.nickname
      userInfo.real_name = data.data.real_name
      userInfo.user_name = data.data.user_name
      userInfo.member_valid_time = data.data.member_valid_time  // 是否是会员-时间
      userInfo.id = data.data.id  // 用户id
      delete userInfo.status_code
      app.setUserData(userInfo)
      app.toast('登录成功')
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }).catch((e) => {
    console.log('获取数据错误====' + JSON.stringify(e))
  })
}

var Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  // public method for encoding
  , encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      }
      else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    } // Whend 

    return output;
  } // End Function encode 


  // public method for decoding
  , decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    } // Whend 

    output = Base64._utf8_decode(output);

    return output;
  } // End Function decode 


  // private method for UTF-8 encoding
  , _utf8_encode: function (string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    } // Next n 

    return utftext;
  } // End Function _utf8_encode 

  // private method for UTF-8 decoding
  , _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    } // Whend 

    return string;
  } // End Function _utf8_decode 

}
// Page({   // 手机号登录

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     title: '登录',
//     navH: app.globalData.navHeight,
//     phoneNum: '', // 手机号
//     pwd: '', // 密码
//     isShowPhoneBtn: true,
//     isPwdInputType: true,
//     bottom: [
//       {id: 1, name: '注册账号'},
//       {id: 2, name: '忘记密码'},
//     ]
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     that = this
//     that.setData({
//       navH: app.globalData.navHeight,
//     })
//   },
//   phoneInput (e) { // 输入手机号码
//     if (e.detail.value.length > 0) {
//       that.setData({
//         phoneNum: e.detail.value,
//         isShowPhoneBtn: false
//       })
//     } else {
//       that.setData({
//         isShowPhoneBtn: true
//       })
//     }
//   },
//   pwdInput(e) { // 输入密码
//     that.setData({
//       pwd: e.detail.value
//     })
//   },
//   clearPhoneNumBindTap () {
//     that.setData({
//       phoneNum: '',
//       isShowPhoneBtn: true
//     })
//   },
//   passTypechange() { // 显示密码，直接取反
//     that.setData({
//       isPwdInputType: !that.data.isPwdInputType
//     })
//   },
//   login () { // 登录
//     if (!that.data.phoneNum) {
//       app.toast('手机号不能为空')
//       return
//     }
//     if (!that.data.pwd) {
//       app.toast('密码不能为空')
//       return
//     }
//     if (that.data.pwd.length < 6) {
//       app.toast('密码不能少于6位数')
//       return
//     }
//     postLoginData()
//   },
//   registerClick (e) {
//     let tId = JSON.stringify(e.currentTarget.dataset.id)  // 类型id,判断是注册还是忘记密码
//     let title = e.currentTarget.dataset.title
//     wx.navigateTo({
//       url: '/pages/register/register?tId=' + tId + '&title=' + title,
//     })
//   },
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },
//   getInfo() { // 获取用户信息
//     wx.showLoading({
//       title: '正在加载...',
//     });
//     var url = app.config.apiUrl + 'api/user/index';
//     var params = {
//       remember_token: app.globalData.token
//     }
//     app.server.postRequest(url, params).then((data) => {
//       wx.hideLoading()
//       console.log(data)
//       if (data.status_code === 'success') {
//         var userInfo = data.data
//         var key =  'token'
//         var value = app.globalData.token
//         userInfo[key] = value  // 往对象中添加一个对象
//         app.setUserData(userInfo)
//         that.setData({
//           userInfo: userInfo
//         })
//         wx.switchTab({
//           url: '/pages/index/index',
//         })
//       } else {
//         app.toast('获取失败')
//       }
//     }).catch((e) => {
//       console.log('获取数据错误====' + JSON.stringify(e))
//     })
//   },
//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })
// // 提交登录请求
// function postLoginData() {
//   wx.showLoading({
//     title: '正在登录...',
//   });
//   var url = app.config.apiUrl + 'api/login/index';
//   var params = {
//     "user_name": that.data.phoneNum,
//     "password": that.data.pwd,
//   }
//   app.server.postRequest(url, params).then((data) => {
//     wx.hideLoading()
//     console.log(data)
//     console.log(data.status_code)
//     if (data.status_code === 'success') {
//       console.log('登录======' + JSON.stringify(data))
//       app.globalData.token = data.data.remember_token
//       // 微信登录
//       // wx.login({
//       //   success: res => {
//       //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       //     console.log('微信登录====' + JSON.stringify(res));
//       //     app.globalData.code = res.code;
//       //     loadOpenId(data.data);   // 获取到openId才算登录成功
//       //   }
//       // })
//       that.getInfo()
//       app.toast('登录成功')
//     } else if (data.status_code == 'fail'){
//       // console.log('数据提交失败')
//       app.toast('账号或密码错误')
//     }
//   }).catch((e) => {
//     console.log('获取数据错误====' + JSON.stringify(e))
//   })
// }

// // 获取openId
// function loadOpenId(loginData) {
//   let urlStr = app.config.apiUrl + 'api/wechat/pay';
//   let params = {
//     remember_token: app.globalData.token,
//     code: app.globalData.code
//   }
//   console.log('获取openId参数======' + JSON.stringify(params));
//   app.server.postRequest(urlStr, params).then((data) => {
//     wx.hideLoading();
//     console.log('获取openId返回数据======' + JSON.stringify(data))
//     // if (data.status_code === 200 && data.data.openid) {
//     //   console.log('进来了')
//     //   loginData.openId = data.data.openid;
//     //   app.setUserData(loginData)
//     if (data) {
//       // app.toast('登录成功！');
//       // that.getInfo()
//       // setTimeout(function(){
//       //   wx.reLaunch({
//       //     url: '/pages/index/index'
//       //   });
//       // },1000)
//     } else if (data.error === 1) {    // 登录过期
//       app.toast('登录失败 openid：' + JSON.stringify(res.data.content));
//     } else {
//       app.toast('登录失败 openid：' + JSON.stringify(res.data.content));
//     }
//   }).catch((e) => {
//     wx.hideLoading();
//     app.toast('服务器未知错误' + JSON.stringify(e));
//   });
// }