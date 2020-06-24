<<<<<<< HEAD
# smallProgram
小程序
=======
# ANGUAN-TEST-LOG

#### 介绍
  ANGUAN-TEST-LOG 1.0 小程序

#### 使用说明

1. 配置config.js 中的 apiUrl 修改为自己的域名
2. 配置微信开发工具中小程序的appid
3. 前往ANGUAN-TEST-LOG后台配置小程序 appid 和 AppSecret 
3. 前往微信小程序后台配置业务，下载 合法域名

### 目录结构

~~~
└─view 小程序存放根目录
  ├─common 公共配置文件
  │ ├─css 公共样式
  │ ├─js 公共js配置
  │ │ ├─config.js 公共配置
  │ │ ├─cookie.js 本地管理
  │ │ └─server.js 网路请求相关
  │ ├─libs 地图相关
  │ ├─wxParse 富文本解析
  │ └─wxss 过滤器
  ├─dist iview组件
  ├─images 图片目录
  ├─components 组件目录
  │ └─pickerYMDH  时间选择器
  ├─pages 小程序页面目录
  │ ├─caseTopic 案例题
  │ ├─changePassword 修改密码
  │ ├─index 首页
  │ ├─login 登录
  │ ├─logs 日志
  │ ├─my 我的
  │ ├─myInfo 我的信息
  │ ├─newsDetail 通知详情
  │ ├─practice 练习题-> 单选/多选/判断
  │ ├─questionType 题型界面
  │ ├─register 注册
  │ ├─simulation 模拟考试
  │ ├─transit 模拟考试界面
  │ ├─vip 会员页面
  │ ├─wrongCase 案例题错误
  │ ├─wronglist 错题列表
  │ └─wrongTopice 练习题错题->单选/判断/多选
  ├─utils 工具类目录
  │ └─util.js 工具函数
  ├─app.js 入口文件
  ├─app.json 配置文件
  ├─app.wxss 样式
  ├─config.js 程序配置
  └─project.config.json 项目配置
~~~
>>>>>>> 050f7a2... 答题小程序
