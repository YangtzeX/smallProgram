const app = getApp()
let that
let setIntervalObj = ''; // 倒计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNumInputType: false, // 是否是手机号输入类型
    password: '', // 新密码
    info: '',
    isPwdInputType: true,
    waitingTimeLength: 60, // 倒计时长
    isSendVerifyCode: false // 判断是否可以获取验证码
  },
  pwdInput (e) {
    that.setData({
      password: e.detail.value
    })
  },
  verificationClick (e) {
    that.setData({
      verification: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  /**密码显示隐藏 */
  pwdInputTypeBindTap: function (e) {
    that.setData({
      isPwdInputType: !that.data.isPwdInputType
    });
    that.pwdInput({       // 解决iOS无法切换的问题
      detail: {
        value: that.data.password
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getInfo () {
    let urlStr = app.config.hostUrl + 'user/personalinformation';
    let params = {
      uid: that.data.userData.user.id,
      token: that.data.userData.token,
      service_type: 2,    // 服务类型 2快车 11顺风车
      is_driver: 0
    }
    wx.showLoading({
      title: '正在加载...',
    });
    app.server.postRequest(urlStr, params).then((data) => {
      wx.hideLoading()
      if (data.status === 200) {
        that.setData({
          info: data.data.user
        })
      }
    }).catch((e) => {
      console.log('获取数据错误====' + JSON.stringify(e))
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.getUserData().then((data) => {
    //   console.log(data)
    //   if (data) {
    //     that.setData({
    //       userData: data
    //     })
    //   }
    //   that.getInfo()
    // })
  },
  /**获取验证码 */
  getVerifyCodeBindTap() { //点击验证码
    that = this
    if (!that.data.password) {
      app.toast('新密码不能为空')
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
  /**提交 */
  confirm () {
    if (!this.data.password) {
      app.toast('请输入新密码')
      return
    }
    if (!this.data.verification) {
      app.toast('请输入验证码')
      return
    }
    loadVerifyCodeLogin()
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
// 修改密码
function loadVerifyCodeLogin() {
  let urlStr = app.config.hostUrl + 'user/changepassword'
  let params = {
    token: that.data.userData.token,
    uid: that.data.userData.user.id,
    verify_code: that.data.verification,
    new_password: that.data.password
  }
  app.server.postRequest(urlStr, params).then((data) => {
    if (data.status === 200) {
      app.toast('修改成功')
      setTimeout(function () {
        wx.navigateBack()
      }, 500)
    }
    // loadOpenId(data)
  }).catch((e) => {
    console.log('修改错误====' + JSON.stringify(e))
  })
}
// 获取验证码
function loadVerifyCode() {
  let urlStr = app.config.hostUrl + 'user/sendverifycodebyuid'
  let params = {
    token: that.data.userData.token,
    uid: that.data.userData.user.id,
    mobile_phone: that.data.info.mobile_phone,
    verify_type: 2 // 修改密码
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