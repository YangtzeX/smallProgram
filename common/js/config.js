// 公共配置

// 腾讯地图相关
const QQMapFile = require('../libs/js/qqmap-wx-jssdk.js');

// 高德地图相关
const AMapFile = require('../libs/js/amap-wx.js');


const appName = '安管考试通'
const appId = 'wx2063fcdbd52a029a'
const appTag = 'ANGUAN-TEST-LOG'

// 服务器根域名、接口跟地址
const apiUrl = 'https://exam.codeworker.cn/'
// const apiUrl = hostUrl + 'app/index.php?i=2&v=1.0&from=wxapp&c=entry&a=wxapp&m=fastfood&do='

// 腾讯地图相关
const qqMapKey = 'FMMBZ-AA43J-ADUFQ-KLAXK-GZMJJ-IOBB3'
const qqMapWebServerKey = ''
const qqMapApiUrl = ''

// 高德地图相关
const aMapKey = ''
const aMapWebServerKey = ''
const aMapApiUrl = 'https://restapi.amap.com/'

// 客服热线
const serviceTel = '13613050121'

// 默认的位置信息
const defaultLocation = {
  lng: '113.947866',  // 经度
  lat: '22.737277'    // 纬度
}

// 获取本地数据相关
const storage = {
  userKey: `${appTag}_USER`,
  userInfoKey: `${appTag}_USERINFO`,
  currLocationKey: `${appTag}_CURRLOCATION`,
  receiveAddrKey: `${appTag}_RECEIVEADDR`,
  questionKey: `${appTag}_QUESTION`,  
  // 用户信息 本地存
  setUserData(data) {
    return setStorageData(this.userKey, data)
  },
  // 用户信息 本地取
  getUserData(toPageUrl) {
    return getStorageData(this.userKey, toPageUrl)
  },
  // 用户详细信息 本地存 暂时无用
  setUserInfoData(data) {
    return setStorageData(this.userInfoKey, data)
  },
  // 用户详细信息 本地取 暂时无用
  getUserInfoData(toPageUrl) {
    return getStorageData(this.userInfoKey, toPageUrl)
  },
  // 当前位置信息 本地存
  setCurrLocationData(data) {
    return setStorageData(this.currLocationKey, data)
  },
  // 当前位置信息 本地取
  getCurrLocationData() {
    return getStorageData(this.currLocationKey, '')
  },
  // 订单收货地址 本地存
  setReceiveAddrData(data) {
    return setStorageData(this.receiveAddrKey, data)
  },
  // 订单收货地址 本地取
  getReceiveAddrData() {
    return getStorageData(this.receiveAddrKey, '')
  },
  // // 存储习题的正确/错误个数 本地存
  setQuestionData(data) {
    return setStorageData(this.questionKey, data)
  },
  // // 存储习题的正确/错误个数 本地取
  getQuestionData() {
    return getStorageData(this.questionKey, '')
  }
}

// 保存本地 异步
function setStorageData(key, data) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: data,
      success: function (res) {
        resolve(res)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}

// 获取本地数据 异步 key本地存储数据的标识 toPageUrl跳转的网页地址
function getStorageData(key, toPageUrl = '') {
  console.log(key)
  console.log('链接的值')
  console.log(toPageUrl)
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: function (res) {
        if (!res.data) {
          if (key == storage.userKey || key == storage.userInfoKey) {
            console.log('暂无用户数据' + res.data)
            if (toPageUrl) {      // 需要跳转的页面
              console.log('需要跳转的')
              console.log(toPageUrl)
              wx.reLaunch({
                url: toPageUrl
              })
            }
          }
        }
        resolve(res.data)
      },
      fail: function (e) {
        if (key == storage.userKey || key == storage.userInfoKey) {
          console.log('暂无用户数据')
          if (toPageUrl) {
            wx.reLaunch({
              url: toPageUrl
            })
          }
        }

        // 如果本地未存储有当前的位置信息，则设置默认的位置信息
        if (key == storage.currLocationKey) {
          resolve(defaultLocation)
        } else {
          console.log('本地信息不存在：' + key)
          resolve(null)
        }
      }
    })
  })
}

/**
 * 获取n-m个字符的随机消息字符
 * minLen最小长度
 * maxLen最大长度
 */
function getRandomStr(minLen, maxLen) {
  let randomStr = ''
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  let randomNum = Math.floor(Math.random() * (maxLen - minLen + 1) + minLen)
  if (randomNum > 128) {     // 项目接口一般是16位
    randomNum = 128
  }
  // console.log(chars.length + '====随机数===' + randomNum)
  for (let n = 0; n < randomNum; n++) {
    let index = Math.floor(Math.random() * (chars.length - 0 + 1) + 0)
    if (index < 0) {
      index = 0
    } else if (index >= chars.length) {
      index = chars.length - 1
    }
    // console.log(chars[index] + '====随机数===' + index)
    if (randomStr.length < randomNum) {
      randomStr += chars[index]
    }
  }

  // console.log(randomStr.length + '====随机串===' + randomStr)
  return randomStr
}

// 获取当前日期
function getNowDateStr() {
  let date = new Date()
  let nowYear = date.getFullYear()
  let nowMonth = date.getMonth() + 1
  let toDay = date.getDate()

  return `${nowYear}-${nowMonth}-${toDay}`
}

// 判断是否是Json格式的数据
function isJson(data) {
  try {
    if (typeof data === 'object') {
      return true
    } else if (typeof JSON.parse(data) === 'object') {
      return true
    }
  } catch (e) {
  }
  return false
}


// 自动消失的提示
function toast(msg, mask = false) {
  wx.showToast({
    title: msg + '',
    icon: 'none',
    duration: 2000,
    mask: mask
  })
}


module.exports = {
  appName,
  appId,
  apiUrl,
  QQMapFile,
  AMapFile,
  qqMapKey,
  qqMapWebServerKey,
  qqMapApiUrl,
  aMapKey,
  aMapWebServerKey,
  aMapApiUrl,
  serviceTel,
  defaultLocation,
  storage,
  getRandomStr,
  getNowDateStr,
  isJson,
  toast
}