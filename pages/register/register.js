// pages/register/register.js
const app = getApp()
let that
let setIntervalObj = ''; // 倒计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tId:0,
    phoneNum: '', // 手机号
    pwd: '', // 密码
    newPwd: '', // 确认新密码
    verification: '',// 验证码
    waitingTimeLength: 60, // 倒计时长
    isShowPhoneBtn: true,
    isPwdInputType: true,
    isPwdInputType1: true,
    isSendVerifyCode: false // 判断是否可以获取验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let tId = JSON.parse(options.tId)
    let title = options.title
    that.setData({
      tId: tId,
    })
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 验证手机号格式
  checkMobile(tel) {
    const reg = /^1[3-8]\d{9}$/
    if (reg.test(tel)) {
      return true
    } else {
      return false
    }
  },
  phoneInput (e) { // 输入手机号码
    if (e.detail.value.length > 0) {
      that.setData({
        phoneNum: e.detail.value,
        isShowPhoneBtn: false
      })
    } else {
      that.setData({
        isShowPhoneBtn: true
      })
    }
  },
  pwdInput(e) { // 输入密码
    that.setData({
      pwd: e.detail.value
    })
  },
  newPwdInput(e) { // 确认密码
    that.setData({
      newPwd: e.detail.value
    });
  },
  verificationClick (e) {
    that.setData({
      verification: e.detail.value
    })
  },
  clearPhoneNumBindTap () {
    that.setData({
      phoneNum: '',
      isShowPhoneBtn: true
    })
  },
  passTypechange() { // 显示密码，直接取反
    that.setData({
      isPwdInputType: !that.data.isPwdInputType
    })
  },
  passTypechange1() { // 显示确认密码，直接取反
    that.setData({
      isPwdInputType1: !that.data.isPwdInputType1
    })
  },
  /**获取验证码 */
  getVerifyCodeBindTap() { //点击验证码
    that = this
    if (!that.data.phoneNum) {
      app.toast('手机号不能为空')
    } else if (!that.checkMobile(this.data.phoneNum)) {
      app.toast('请输入正确的手机号')
    } else {
      if (that.data.isSendVerifyCode == false) {
        daojishi();
        loadVerifyCode();
      }
      that.setData({
        isSendVerifyCode: true
      });
    }
  },
  registerClick () { // 注册
    if (that.data.tId === 1) { // 注册
      if (!that.data.phoneNum) {
        app.toast('手机号不能为空')
        return
      } else if (!that.data.pwd) {
        app.toast('新密码不能为空')
        return
      } else if (that.data.pwd.length < 6 ) {
        app.toast('新密码不能少于6位')
        return
      } else if (!that.data.newPwd) {
        app.toast('确认密码不能为空')
        return
      } else if (that.data.pwd !== that.data.newPwd) {
        app.toast('新密码和确认密码不一致')
        return
      } else if (!that.data.verification) {
        app.toast('验证码不能为空')
        return
      }
    } else if (that.data.tId === 2) {
      if (!that.data.phoneNum) {
        app.toast('手机号不能为空')
        return
      } else if (!that.data.pwd) {
        app.toast('新密码不能为空')
        return
      } else if (that.data.pwd.length < 6 ) {
        app.toast('新密码不能少于6位')
        return
      } else if (!that.data.verification) {
        app.toast('验证码不能为空')
        return
      }
    }
    postLoginData()
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (setIntervalObj) {
      clearInterval(setIntervalObj);
    }
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
// 提交注册请求
function postLoginData() {
  wx.showLoading({
    title: '正在注册...',
  });
  if (that.data.tId === 1) {
    var url = app.config.apiUrl + 'api/registe/index';
    var params = {
      user_name: that.data.phoneNum,
      password: that.data.pwd,
      confirm_password:	that.data.newPwd,
      smscode: that.data.verification
    }
  } else if (that.data.tId === 2) {
    var url = app.config.apiUrl + 'api/forgot/password';
    var params = {
      user_name: that.data.phoneNum,
      password: that.data.pwd,
      smscode: that.data.verification
    }
  }
  app.server.postRequest(url, params).then((data) => {
    wx.hideLoading()
    if (data.status_code === 'success') {
      app.toast(data.message)
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login',
        })  
      }, 1000);
    } else if (data.status_code == 'fail'){
      app.toast(data.message)
    }
  }).catch((e) => {
    console.log('获取数据错误====' + JSON.stringify(e))
  })
}
// 获取验证码
function loadVerifyCode() {
  let urlStr = app.config.apiUrl + 'api/send/sms'
  let params = {
    mobile_phone: that.data.phoneNum,
  }
  app.server.postRequest(urlStr, params).then((data) => {
    app.toast('验证码已发送')
  }).catch((e) => {
    console.log('获取数据错误====' + JSON.stringify(e))
    that.setData({
      imgCode: '',
      randomStr: app.config.getRandomStr(4, 4)
    })
  })
}
// 倒计时
function daojishi() {
  setIntervalObj = setInterval(function () {
    if (that.data.waitingTimeLength > 0) {
      that.setData({
        waitingTimeLength: that.data.waitingTimeLength - 1
      });
    } else {
      clearInterval(setIntervalObj);
      that.setData({
        waitingTimeLength: 60,
        isSendVerifyCode: false
      });
    }
  }.bind(that), 1000);
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