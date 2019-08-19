// pages/list/list.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: [
      {malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍1', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍2', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍3', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍4', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍5', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍6', resDate: '2019/06/08 00:00:00'}, 
      { malfunctionNo: 2, date: '2019/06/08 00:00:00', laMsg: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍得到惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍7', resDate: '2019/06/08 00:00:00'}],
    handleMsg: [],
    malfunctionType: ['xxxx', '电脑故障', '打印机故障', '其他问题']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleMsg();
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
    //this.getMsg();
    // if (0 === app.globalData.jobNo.length){
    //   app.showTips("使用提示", "请扫个人报修码进行设备报修", false);
    //   return;
    // }
    
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
    this.handleMsg();
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
      url: "https://www.baidu.com",
      method: "POST",
      data: {
        jobNo: app.globalData.jobNo
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
        _this.setData({
          msg: res.data
        });
        console.log(_this);
      },
    })
  },

  //处理数据
  handleMsg(){
    let msg = util.objCopy(this.data.msg);
    for(let item of msg){
      item.laMsg = `${item.laMsg.substr(0, 40)}.....`;
      item.malfunctionNo = this.data.malfunctionType[item.malfunctionNo];
    }
    console.log(this);
    this.setData({handleMsg: msg});
  }
})