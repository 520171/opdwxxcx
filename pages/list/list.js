// pages/list/list.js
const util = require('../../utils/util.js');
const app = getApp();
const host = require('../../config.js').host
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: [],
    handleMsg: [],
    malfunctionType: ['xxxx', '电脑故障', '打印机故障', '其他问题'],
    success: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (0 === app.globalData.jobNo.length){
      app.showTips("使用提示", "请扫个人报修码进行设备报修", false);
      this.setData({ success: false});
      return;
    }
    this.getMsg();
    
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
    this.getMsg();
    this.handleMsg();
    wx.stopPullDownRefresh();
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
  //从服务器获取报修信息
  getMsg(){
    let _this = this;
    wx.request({
      url: `${host}/users/getMsg`,
      method: "POST",
      data: {
        jobNo: app.globalData.jobNo
      },
      header: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      success: function (res) {
        //console.log(res.data);
        if ('fail' != res.data.message){
          _this.setData({
            msg: res.data.message,
            success: true
          });
          _this.handleMsg();
          app.globalData.detail = _this.data.msg;
        }else{
          _this.setData({ success: false });
        }
      },
      fail: function(){
        _this.setData({success: false})
      }
    })
  },

  //处理数据
  handleMsg(){
    let msg = util.objCopy(this.data.msg);
    for(let item of msg){
      if (22 < item.s_msg.length){
        item.s_msg = `${item.s_msg.substr(0, 22)}.....`;
      }
      item.s_type = this.data.malfunctionType[item.s_type];
    }
    this.setData({handleMsg: msg});
  },
  detail(event){
    let index = event.target.dataset.index;
    console.log(index);
    let sid = app.globalData.detail[index].s_id;
    this.getAnnex(index, sid);
  },
  getAnnex(index, sid) {
    let _this = this;
    wx.request({
      url: `${host}/users/getAnnex`,
      method: "POST",
      data: {
        sid: sid
      },
      header: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      success: function (res) {
        //console.log(res.data);
        if ('fail' != res.data.message){
          console.log(res.data.message);
          _this.handleAnnex(res.data.message);
          console.log(app.globalData.annexImgs);
          console.log(app.globalData.annexVideos);
          wx.navigateTo({
            url: `../details/details?index=${index}`
          });
        }else{
          wx.showToast({
            title: '请求失败',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  handleAnnex(annexes){
    app.globalData.annexImgs.length = 0;
    app.globalData.annexVideos.length = 0;
    for (let item of annexes){
      if(item.a_isImg){
        app.globalData.annexImgs.push(item.a_url);
      }else{
        app.globalData.annexVideos.push(item.a_url);
      }
    }
  }
})