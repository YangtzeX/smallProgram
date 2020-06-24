//接下来需要将sessinid在本地管理的方法
var ceshi = '111'
var token;
var sessiondate;
//可以封装一个保存sessinid的方法，将sessionid存储在localstorage中，定为半小时之后清空此sessionid缓存。
export const saveSession = function (sessionId) {
  console.log(sessionId)
  console.log(" now save sessionid: " + sessionId)
  wx.setStorageSync('token', sessionId)//保存sessionid
  wx.setStorageSync('sessiondate', Date.parse(new Date()))//保存当前时间，
}
function saveSessions(sessionId) {
  console.log(sessionId)
  console.log(" now save sessionid: " + sessionId)
  wx.setStorageSync('token', sessionId)//保存sessionid
  wx.setStorageSync('sessiondate', Date.parse(new Date()))//保存当前时间，
}
// 过期后清除session缓存
function removeLocalSession() {
  wx.removeStorageSync('sessionid的key')
  wx.removeStorageSync(sessiondate)
  console.log("remove session!")
}



//检查sessionid是否过期的方法

function checkSessionTimeout() {
  var sessionid = wx.getStorageSync(token)
  if (sessionid == null || sessionid == undefined || sessionid == "") {
    console.log("session is empty")
    return false
  }
  var sessionTime = wx.getStorageSync(sessiondate)
  var aftertimestamp = Date.parse(new Date())
  if (aftertimestamp - sessionTime >= SESSION_TIMEOUT) {
    removeLocalSession()
    return false
  }
  return true
}

//如果sessionid过期，重新获取sessionid

function checkSessionOk() {
  console.log("check session ok?...")
  var sessionOk = checkSessionTimeout()
  if (!sessionOk) {
    requestsessionid(function () {
    })
  }
}



//定义一个方法每隔一段时间检查sessionid是否过期

function checkcrosstime() {
  setInterval(checkSessionTimeout, 25 * 60 * 1000)//这个时间可以自定义。比如25 * 60 * 1000（代表25分钟）
}
module.exports = {
  ceshi,
  saveSession,
  saveSessions,
  removeLocalSession,
  checkSessionTimeout,
  checkSessionOk
}