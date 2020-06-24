// 网络请求相关

const config = {}

// 初始化 config为 config.js的配置信息
export const init = function (config) {
  config.myQQMapFile = new config.QQMapFile({ key: config.qqMapKey })
  config.myAmapFun = new config.AMapFile.AMapWX({ key: config.aMapKey })
  this.config = config
  return this
}

export const test = function () {
  console.log(this.config.apiUrl)
}

// 获取当前位置-定位 refresh默认刷新当前位置信息
export const getLocation = function (refresh = true) {
  let that = this
  return new Promise((resolve, reject) => {
    if (refresh == true) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          that.config.storage.setCurrLocationData({ lng: res.longitude, lat: res.latitude })
          resolve(res)
        },
        fail: function (e) {
          console.log('拒绝了')
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userLocation'] == false) {
                // isShowAuthSet = true
                console.log('没有授权')
              }
              // that.setData({
              //   // isShowAuthSet: isShowAuthSet
              //   console.log('授权')
              // })
            }
          })
          reject(e)
        }
      })
    } else {
      that.config.storage.getCurrLocationData().then((res) => {
        resolve(res)
      })
    }
  })
}

/**
 * 经纬度转地址
 * mapType: 默认使用腾讯地图
 * lng: 经度
 * lat: 纬度
 */
export const reverseGeocoder = function (lng, lat, isGetPoi = false, mapType = 'tencent') {
  let that = this
  return new Promise((resolve, reject) => {
    if (mapType == 'tencent') {
      that.config.myQQMapFile.reverseGeocoder({
        location: {
          longitude: lng,
          latitude: lat
        },
        get_poi: isGetPoi ? 1 : 0,
        poi_options: 'policy=2',
        success: function (res) {//成功后的回调
          console.log(res)
          resolve(res.result)
        },
        fail: function (error) {
          resolve('')
        }
      })
    } else {

    }
  })
}

/**
 * 地图搜索
 * mapType: 默认使用腾讯地图
 * lng: 经度
 * lat: 纬度
 */
export const mapSearch = function (keyword, city, mapType = 'tencent') {
  let that = this
  console.log(city)
  return new Promise((resolve, reject) => {
    if (mapType == 'tencent') {
      that.config.myQQMapFile.search({
        keyword: (keyword ? city : '') + ' ' + keyword,
        region: city,
        page_size: 20,
        auto_extend: city ? 0 : 1,    // 取值1：[默认]自动扩大范围；取值0：不扩大。 仅适用于默认周边搜索以及制定地区名称搜索。
        success: function (res) {//成功后的回调
          // console.log(res)
          resolve(res.data)
        },
        fail: function (error) {
          resolve('')
        }
      })
    } else {

    }
  })
}




/**
 * 地图路线规划
 * mapType: 默认使用腾讯地图
 * orLng: 起点经度
 * orLat: 起点纬度
 * deLng: 起点经度
 * deLat: 起点纬度
 */
export const mapRoutesPath = function (type, orLng, orLat, deLng, deLat, waypoints, mapType = 'tencent') {
  console.log('进来')
  console.log(orLng)
  console.log(orLat)
  console.log(deLng)
  console.log(deLat)
  // console.log(typeof(waypoints))
  // var ceshi = waypoints.substr(0,waypoints.length - 1)
  // console.log(ceshi)
  let that = this
  return new Promise((resolve, reject) => {
    if (mapType == 'tencent') {
      that.config.myQQMapFile.direction({
        mode: type,   // 可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: {
          latitude: orLat,
          longitude: orLng
        },
        to: {
          latitude: deLat,
          longitude: deLng
        },
        // waypoints: ceshi,
        // waypoints:"22.637063,114.030726;22.629986,114.025016",
        // ;;22.628342,114.030209
        //;;22.629986,114.025016
        // waypoints: waypoints,
        // waypoints:{
        //   "22.637063,114.030726"
        //   "22.628342,114.030209"
        //   "22.629986,114.025016"
        // },
        // waypoints: "22.619501,114.024572;22.628342,114.030209",
        // waypoints: "22.628342,114.030209",
        // waypoints: "22.619501,114.024572" + ';' +"22.628342,114.030209",
        success: function (res) {
          console.log(res)
          var ret = res
          var coors = ret.result.routes[0].polyline, paths = []
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组paths中
          for (var i = 0; i < coors.length; i += 2) {
            paths.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          console.log(paths)
          // //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          // _this.setData({
          //   latitude: paths[0].latitude,
          //   longitude: paths[0].longitude,
          //   polyline: [{
          //     points: paths,
          //     color: '#FF0000DD',
          //     width: 4
          //   }]
          // })
          resolve(paths)
        },
        fail: function (error) {
          console.error(error)
          resolve('')
        }
      })
    } else {

    }
  })
}


/**
 * 网络请求基础方法
 * method: GET
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认不进行数据加密 过滤第三方接口
 */
export const getRequest = function (urlStr, params, isEncode = false) {
  let that = this
  return request(that, 'GET', urlStr, params, isEncode)
}

/**
 * 网络请求基础方法
 * method: POST
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认进行数据加密 过滤第三方接口
 */
export const postRequest = function (urlStr, params, isEncode = false) {
  let that = this
  return request(that, 'POST', urlStr, params, isEncode)
}

/**
 * 网络请求基础方法
 * method: POST GET
 * urlStr: 请求接口Url
 * params: 请求参数
 * isEncode: 默认进行数据加密
 */
function request(that, method, urlStr, params, isEncode = false) {
  let paramsObj = params ? params : {}
  // paramsObj.sign = that.config.getRandomStr(32, 32)
  if (isEncode == true) {   // 需要校验加密

  } else {
  }
  let promise = new Promise((resolve, reject) => {
    wx.request({
      url: urlStr,
      header: {
        'content-type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json' // 默认值 application/json
      },
      // header: headers,
      method: method,
      data: paramsObj,
      success: function (res) {
        let data = res.data
        if (data.status_code == 'success') {
          // console.log(urlStr + '====根数据=======' + JSON.stringify(data))
          // console.log(urlStr + '====根数据=======' + data.data)
          resolve(data) // 返回到当前接口做数据处理
          // console.log(data) 
        } else if (data.length>0) {  // 模拟考试题题,返回的数据没有状态码,所以这里多添加了一个判断条件
          resolve(data)
        }else {
          wx.hideLoading()
          if (data.status_code === '304') {
            that.config.toast('登录过期,请重新登录')
            let setTimeoutObj = setTimeout(() => {
              clearTimeout(setTimeoutObj)
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }, 2000);
          }
          resolve(data)
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          console.log('根数据返回错误123=======' + JSON.stringify(res))
        }
      },
      fail: function (e) {
        that.config.toast(JSON.stringify(e))
        reject(e)
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  })
  return promise
}

/**
 * 上传文件封装
 * urlStr 请求链接
 * filePath 文件路径
 * name 文件对应的key
 * params 参数
 * isEncode 是否加密
 */
export const uploadFile = function (urlStr, filePath, name, params, isEncode = true) {
  let that = this
  return uploadFileRequest(that, urlStr, filePath, name, params, isEncode)
}

/**
 * 文件上传基础方法
 * urlStr 请求链接
 * filePath 文件路径
 * name 文件对应的key
 * params 参数
 * isEncode 是否加密
 */
export const uploadFileRequest = function (that, urlStr, filePath, name, params, isEncode) {
  console.log(name)
  let promise = new Promise((resolve, reject) => {
    console.log(name)
    wx.uploadFile({
      url: urlStr,
      filePath: filePath,
      name: name,
      formData: params,
      success: function (res) {
        console.log('上传图片返回了')
        res.data = JSON.parse(res.data)
        resolve(res)
      },
      fail: function (e) {
        that.config.toast(JSON.stringify(e))
        reject(e)
      }
    })
  })
  return promise
}

// 判断是否为json格式的数据
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