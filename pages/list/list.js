// pages/list/list.js
const util = require('../../utils/util.js');
const app = getApp();
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
   
    this.getMsg();
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
      url: "http://111.230.184.6:8000/users/getMsg",
      method: "POST",
      data: {
        jobNo: app.globalData.jobNo
      },
      header: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      success: function (res) {
        //console.log(res.data);
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        _this.setData({
          msg: res.data.message.reverse(),
          success: true
        });
        _this.handleMsg();
        app.globalData.detail = _this.data.msg;
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
    console.log(event.target.dataset.index);
    wx.navigateTo({
      url: `../details/details?index=${event.target.dataset.index}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
})