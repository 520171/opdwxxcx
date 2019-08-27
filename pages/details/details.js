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
    videosArr: [],
    dialogs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.index);
    let index = options.index;
    this.setData({
      imgsArr: app.globalData.annexImgs,
      videosArr: app.globalData.annexVideos,
      detail: app.globalData.detail[index]
    });
    console.log(this.data.detail);
    this.getDialogs();
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
  },
  getDialogs() {
    let _this = this;
    wx.request({
      url: "http://111.230.184.6:8000/users/getDialogs",
      method: "POST",
      data: {
        sid: _this.data.detail.s_id
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
        console.log(res.data.message);
        _this.setData({dialogs: res.data.message});
      },
      fail: function () {
        _this.setData({ success: false })
      }
    })
  }

})
