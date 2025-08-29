import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()
Page({
  data: {
    enable: false,
    cardInfo: [],
    scrollViewHeight: 0, //容器高度
    scrollEnabled: true,
    rowCol: [{
      size: '327rpx',
      borderRadius: '24rpx'
    }, 1, {
      width: '61%'
    }],

    // 发布
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  // 生命周期
  async onReady() {
    const [cardRes] = await Promise.all([
      request('/home/cards').then((res) => res.data)
    ]);
    const fileIDs = cardRes.data.flatMap(item => item.list);
    wx.cloud.getTempFileURL({
      fileList: fileIDs,
      success: res => {
        const urlMap = {};
        console.log(res.fileList)
        res.fileList.forEach(file => {
          urlMap[file.fileID] = file.tempFileURL;
        });
        // 替换 cardRes 里的 list
        const newCards = cardRes.data.map(card => ({
          ...card,
          list: card.list.map(fid => urlMap[fid]) // fileID -> https 地址
        }));
        console.log(newCards)
        this.setData({
          cardInfo: newCards,
          focusCardInfo: cardRes.data.slice(0, 3),
        });
      },
      fail: console.error,
    });
  },
  onLoad(option) {
    //1:app参数
    const {
      bottomSafeHeight,
      navAllHeight,
      screenHeight,
    } = getApp().globalData;
    this.setData({
      screenHeight,
      bottomSafeHeight,
      navAllHeight,
      scrollViewHeight: screenHeight - navAllHeight - 70 - bottomSafeHeight,
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (option.oper) {
      let content = '';
      if (option.oper === 'release') {
        content = '发布成功';
      } else if (option.oper === 'save') {
        content = '保存成功';
      }
      this.showOperMsg(content);
    }
  },
  onRefresh() {
    this.refresh();
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    const [cardRes, swiperRes] = await Promise.all([
      request('/home/cards').then((res) => res.data),
      request('/home/swipers').then((res) => res.data),
    ]);

    setTimeout(() => {
      this.setData({
        enable: false,
        cardInfo: cardRes.data,
        swiperList: swiperRes.data,
      });
    }, 1500);
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },
  goRelease() {
    wx.navigateTo({
      url: '/pages/release/index',
    });
  },
  // 跳转
  jumpTo(event) {
    wx.setStorageSync('eventData', event.currentTarget.dataset || event);
    wx.navigateTo({
      url: '/pages/detail/index',
      routeType: 'wx://zoom',
    })
  },
});
