// pages/detail/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    current: 0,
    swiper_list: [],
    eventData: wx.getStorageSync('eventData').item,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //1:接收全局数据
    const {
      baseURL,
      screenWidth,
      screenHeight,
      statusBarHeight,
      navAllHeight,
      navigationBarHeight,
      bottomSafeHeight,
      scene,
    } = app.globalData;
    // 读取本地存储
    const eventData = wx.getStorageSync('eventData').item;
    console.log("详情页接收到数据：", eventData);
    //最后：塞入data
    this.setData({
      scene,
      baseURL,
      screenWidth,
      screenHeight,
      statusBarHeight,
      navigationBarHeight,
      navAllHeight,
      bottomSafeHeight,
      swiperHeight: screenWidth / 1.25,
      eventData,
      swiper_list: eventData.list,
      loading: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
