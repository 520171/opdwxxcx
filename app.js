//app.js
App({
  // onLaunch: function (option) {
  //   // 展示本地存储能力
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  globalData: {
    userInfo: null,
    name: "",
    jobNo: "",
    department: 0,
    departmentName:'',
    gender: 0,
    
    detail: [],
    //记录图片或视频数组
    annexImgs: [],
    annexVideos: []
  },
  onLaunch: function(option){
    let _this = this;
    let name = option.query.name;
    let jobNo = parseInt(option.query.jobNo);
    let department = parseInt(option.query.department);
    let gender = option.query.gender;

    name = name? name : "abc";
    jobNo = jobNo ? jobNo : "1001";
    department = isNaN(department) ? 1 : department;
    gender = isNaN(gender) ? 0 : gender;

    if (name.length && jobNo.length){
      wx.request({
        url: "http://111.230.184.6:8000/users/login",
        method: "POST",
        data: {
          jobNo: jobNo,
          name: name
        },
        header: {
          "Content-Type": 'application/json;charset=UTF-8'
        },
        success: function (res) {
          console.log(res.data);
          if ('fail' != res.data.message) {
            _this.globalData.name = res.data.msg[0].u_name;
            _this.globalData.jobNo = res.data.msg[0].u_jobno;
            _this.globalData.department = res.data.msg[0].d_no;
            _this.globalData.departmentName = res.data.msg[0].d_name;
            _this.globalData.gender = res.data.msg[0].u_gender;
          } else {
            _this.globalData.name = "";
            _this.globalData.jobNo = "";
            _this.globalData.department = "";
            _this.globalData.gender = 0;
            _this.globalData.departmentName="";
          }
          if (_this.onReadyCallback){
            _this.onReadyCallback();
          }
        },
        fail: function () {
          _this.globalData.name = "";
          _this.globalData.jobNo = "";
          _this.globalData.department = "";
          _this.globalData.gender = 0;
          _this.globalData.departmentName = "";
        }
      })
    }

  },
  //显示对话框
  showTips: function (title, msg, showCancel) {
    wx.showModal({
      title: title,
      content: msg,
      showCancel: showCancel,
      success(res) {
        // _this.showTips();
      }
    })
  }
})