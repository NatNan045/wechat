// app.js
import config from './config';
import Mock from './mock/index';
import createBus from './utils/eventBus';
import { connectSocket, fetchUnreadNum } from './mock/chat';

if (config.isMock) {
  Mock();
}

App({
  onLaunch() {
    // 云存储初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'natnan-1g5vcogn1f2d9909', // 这里换成你的环境ID
        traceUser: true, // 是否在用户访问记录中带上用户信息
      })
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    this.getUnreadNum();
    this.connect();

    // 设备获取
    const WindowInfo = wx.getWindowInfo();
    this.globalData.statusBarHeight = WindowInfo.statusBarHeight;
    this.globalData.screenWidth = WindowInfo.screenWidth;
    this.globalData.screenHeight = WindowInfo.screenHeight;
    // -- 头部整体高度：状态栏高度+导航栏高度----
    const menuRect = wx.getMenuButtonBoundingClientRect();
    const navigationBarHeight =
      menuRect.height + (menuRect.top - WindowInfo.statusBarHeight) * 2;
    const navAllHeight = navigationBarHeight + WindowInfo.statusBarHeight;
    this.globalData.menuRect = menuRect;
    this.globalData.navAllHeight = navAllHeight;
    this.globalData.navigationBarHeight = navigationBarHeight;
    // -- 获取底部安全区域高度
    const bottomSafeHeight =
      WindowInfo.screenHeight - WindowInfo.safeArea.bottom;
    this.globalData.bottomSafeHeight = bottomSafeHeight;
  },
  globalData: {
    userInfo: null,
    unreadNum: 0, // 未读消息数量
    socket: null, // SocketTask 对象
    statusBarHeight: 0,
    bottomSafeHeight: 0, //底部安全区域高度
    navAllHeight: 0, //头部整体高度
    navigationBarHeight: 0, //将囊栏高度
    screenWidth: 0, //屏幕宽度
    screenHeight: 0, //屏幕高度
    menuRect: null,
  },

  /** 全局事件总线 */
  eventBus: createBus(),

  /** 初始化WebSocket */
  connect() {
    const socket = connectSocket();
    socket.onMessage((data) => {
      data = JSON.parse(data);
      if (data.type === 'message' && !data.data.message.read) this.setUnreadNum(this.globalData.unreadNum + 1);
    });
    this.globalData.socket = socket;
  },

  /** 获取未读消息数量 */
  getUnreadNum() {
    fetchUnreadNum().then(({ data }) => {
      this.globalData.unreadNum = data;
      this.eventBus.emit('unread-num-change', data);
    });
  },

  /** 设置未读消息数量 */
  setUnreadNum(unreadNum) {
    this.globalData.unreadNum = unreadNum;
    this.eventBus.emit('unread-num-change', unreadNum);
  },
});
