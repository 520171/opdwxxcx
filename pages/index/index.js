//index.js
//获取应用实例
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const upFiles = require('../../utils/upFiles.js')
const host = require('../../config.js').host
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    warn: true, //控制报修类型是否显示警告图标，true:不显示，false显示
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "",
    department: 0,
    jobNo: "",
    gender: 0,
    departmentName:"",
    malfunctionNo: 0,
    malfunctionType: ['--请选择故障类型--', '---电脑故障---', '---打印机故障---', '---其他问题---'],
    date: '',
    detailMsg: "",
    textAreaMsg: '',
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
  onLoad: function(){
    const _this = this
    _this.setData({
      name: app.globalData.name,
      department: app.globalData.department,
      jobNo: app.globalData.jobNo,
      gender: app.globalData.gender,
      departmentName: app.globalData.departmentName
    });

    app.onReadyCallback = function(){
      _this.setData({
        name: app.globalData.name,
        department: app.globalData.department,
        jobNo: app.globalData.jobNo,
        gender: app.globalData.gender,
        departmentName: app.globalData.departmentName
      });
      console.log(app.globalData.jobNo.length)
      if (0 === app.globalData.jobNo.length) {
        _this.setData({ canUse: false });
      }else{
        _this.setData({ canUse: true });
      }
      console.log(_this);
    }

    if (0 === app.globalData.jobNo.length) {
      _this.setData({ canUse: false })
    } else {
      _this.setData({ canUse: true })
    }

  },
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
    const _this = this;
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
    const _this = this;
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
    const _this = this
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
      app.showTips("提交失败", "请选择报修类型！！！", false)
      return;
    }
    let date = util.formatTime(new Date())
    this.data.detailMsg = e.detail.value.msg
    this.data.date = date
    this.postMsg()
  },
  //提交请求
  postMsg: function(){
    const _this = this
    console.log(this.data)
    wx.request({
      url: `${host}/users/repair`,
      method: "POST",
      data: {
        name: this.data.name,
        department: this.data.department,
        departmentName: app.globalData.departmentName,
        jobNo: this.data.jobNo,
        gender: this.data.gender,
        malfunctionNo: this.data.malfunctionNo,
        detailMsg: this.data.detailMsg,
        date: this.data.date
      },
      header: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      success: function (res) {
        // console.log(res.data)
        // 将响应的报修表的id回传到图片提交的方法中
        if ('fail' != res.data.message){
          _this.postImg(res.data.insertId, function () {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })

            wx.switchTab({
              url: '/pages/list/list'
            })
            // 重置
            _this.setData({
              textAreaMsg: '',
              malfunctionNo: 0,
              upFilesProgress: false,
              upImgArr: [],
              upVideoArr: []
            })
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'success',
            duration: 2000
          })

        }
      },
      fail: function(){
        wx.showToast({
          title: '提交失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  postImg(insertId, success){
    const _this = this
    let upData = {}
    let upImgArr = _this.data.upImgArr
    let upVideoArr = _this.data.upVideoArr
    console.log(upImgArr)
    console.log(upVideoArr)
    _this.setData({
      upFilesProgress: true
    })
    upData['url'] = config.service.upFiles
    //传递报修表的id
    upData.formData = { insertId:insertId }
    upFiles.upFilesFun(_this, upData, function (res) {
      if (res.index < upImgArr.length) {
        upImgArr[res.index]['progress'] = res.progress
        _this.setData({
          upImgArr: upImgArr,
        })
      } else {
        let i = res.index - upImgArr.length
        upVideoArr[i]['progress'] = res.progress
        _this.setData({
          upVideoArr: upVideoArr,
        })
      }
      //   console.log(res)
    }, success)
    //
  }
})
