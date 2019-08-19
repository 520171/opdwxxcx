//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')

const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,

    warn: true, //控制报修类型是否显示警告图标，true:不显示，false显示
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "",
    department: "",
    jobNo: "",
    malfunctionNo: 0,
    malfunctionType: ['--请选择故障类型--', '---电脑故障---', '---打印机故障---', '---其他问题---'],
    date: '',
    detailMsg: "",

    //github
    upFilesBtn: true,
    upFilesProgress: false,
    maxUploadLen: 6,
    upImgArr: [],
    upVideoArr: [],

    canUse: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(){},
  onShow: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

    if (0 === app.globalData.jobNo.length){
      app.showTips("使用提示", '请扫个人报修码进行设备报修', false);
      //this.setData({ canUse: false });
    }else{
      this.setData({
        name: app.globalData.name,
        department: app.globalData.department,
        jobNo: app.globalData.jobNo
      })
    }
    console.log(this);
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //选择器改变时触发的方法
  bindPickerChange: function(event){
    let malfunctionNo = event.detail.value;
    console.log(`选择的下标为${malfunctionNo}`);
    //当报修类型改变时判断是否显示图标
    if (0 == malfunctionNo){
      this.setData({ malfunctionNo: malfunctionNo, warn: false});
    }else{
      this.setData({ malfunctionNo: malfunctionNo, warn: true});
    }
    
  },

  //github
  // 预览图片
  previewImg: function (e) {
    let imgsrc = e.currentTarget.dataset.presrc;
    let _this = this;
    let arr = _this.data.upImgArr;
    let preArr = [];
    arr.map(function (v, i) {
      preArr.push(v.path)
    })
    //   console.log(preArr)
    wx.previewImage({
      current: imgsrc,
      urls: preArr
    })
  },
  // 删除上传图片 或者视频
  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除嘛？',
      success: function (res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let upImgArr = _this.data.upImgArr;
          let upVideoArr = _this.data.upVideoArr;
          if (delType == 'image') {
            upImgArr.splice(delNum, 1)
            _this.setData({
              upImgArr: upImgArr,
            })
          } else if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            _this.setData({
              upVideoArr: upVideoArr,
            })
          }
          let upFilesArr = upFiles.getPathArr(_this);
          if (upFilesArr.length < _this.data.maxUploadLen) {
            _this.setData({
              upFilesBtn: true,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  // 选择图片或者视频
  uploadFiles: function (e) {
    if(!this.data.canUse){
      return;
    }
    var _this = this;
    wx.showActionSheet({
      itemList: ['选择图片', '选择视频'],
      success: function (res) {
        //   console.log(res.tapIndex)
        let xindex = res.tapIndex;
        if (xindex == 0) {
          upFiles.chooseImage(_this, _this.data.maxUploadLen)
        } else if (xindex == 1) {
          upFiles.chooseVideo(_this, _this.data.maxUploadLen)
        }

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //github
  // 上传文件
  subFormData: function (e) {
    if (0 == this.data.malfunctionNo){
      this.setData({warn: false});
      app.showTips("提交失败", "请选择报修类型！！！", false);
      return;
    }

    let _this = this;
    let upData = {};
    let upImgArr = _this.data.upImgArr;
    let upVideoArr = _this.data.upVideoArr;
    let date = util.formatTime(new Date());

    console.log(upImgArr);
    console.log(upVideoArr);
    _this.setData({
      upFilesProgress: true,
      detailMsg: e.detail.value.msg,
      date : date
    })
    upData['url'] = config.service.upFiles;
    upFiles.upFilesFun(_this, upData, function (res) {
      if (res.index < upImgArr.length) {
        upImgArr[res.index]['progress'] = res.progress
        _this.setData({
          upImgArr: upImgArr,
        })
      } else {
        let i = res.index - upImgArr.length;
        upVideoArr[i]['progress'] = res.progress
        _this.setData({
          upVideoArr: upVideoArr,
        })
      }
      //   console.log(res)
    }, function (arr) {
      // success
      console.log(arr)
    })
    _this.postMsg();
  },
  //提交请求
  postMsg: function(){
    console.log(this.data);
    wx.request({
      url: "http://111.230.184.6:8000/",
      method: "POST",
      data: {
        name: this.data.name,
        department: this.data.department,
        jobNo: this.data.jobNo,
        malfunctionNo: this.data.malfunctionNo,
        detailMsg: this.data.detailMsg,
        date: this.data.date
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
      },
    })
  }

})
