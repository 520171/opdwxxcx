// pages/details/details.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    malfunctionType: ['xxxx', '电脑故障', '打印机故障', '其他问题'],
    imgsArr: [],
    videosArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.index);
    let index = options.index;
    this.setData({detail: app.globalData.detail[index]});
    console.log(this.data.detail);
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
    this.setData({
      imgsArr: app.globalData.annexImgs,
      videosArr: app.globalData.annexVideos
    });
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
  //预览图片
  previewImg(event){
    wx.previewImage({
      current: event.currentTarget.dataset.presrc, // 当前显示图片的http链接
      urls: this.data.imgsArr // 需要预览的图片http链接列表
    })
  }
})
