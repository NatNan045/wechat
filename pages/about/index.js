import {
  getCloudImgUrl
} from '~/utils/cloud.js';
import request from '~/api/request';

const { shared } = wx.worklet
const lerpColor = (begin, end, t) => {
  'worklet'
  const r = begin.r + (end.r - begin.r) * t
  const g = begin.g + (end.g - begin.g) * t
  const b = begin.b + (end.b - begin.b) * t
  const a = begin.a + (end.a - begin.a) * t
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const {screenWidth, screenHeight} = wx.getWindowInfo();
const menuRect = wx.getMenuButtonBoundingClientRect()
const sheetHeight = screenHeight - (menuRect.bottom + menuRect.height + 60)
console.log(sheetHeight)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    bjUrl: '',
    adverImg: '/static/adver.jpg', // 图片路径存到 data
    // --拖拽相关
    menuRect,
    sheetHeight,
    screenWidth,
    screenHeight,
    minSize: 0.5,
    maxSize: 1,
    sheetHeight: 0,
    // -- 请求数据
    jobList: [],
  },

  onSizeUpdate(e) {
    'worklet'
    const distance = sheetHeight - e.pixels
    this.progress.value = distance >= 20 ? 1 : distance / 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const progress = shared(1)

    

    const bjUrl = await getCloudImgUrl(
      'cloud://natnan-1g5vcogn1f2d9909.6e61-natnan-1g5vcogn1f2d9909-1306169660/wechat/wallhaven-nk1ed6.jpg'
    );
    const jobInfo = await this.getJobInfo();
    this.setData({
      bjUrl,
      jobList: jobInfo.job
    });

    // worklet
   this.applyAnimatedStyle('.top-wrp__inner', () => {
      'worklet'
      const t = progress.value
      const beginColor = {
        r: 241, 
        g: 233, 
        b: 233,
        a: 1
      }

      const endColor = {
        r: 255,
        g: 255,
        b: 255, 
        a: 1
      }

      const spreadRadius = -6 + 8 * t
      const bgColor = lerpColor(beginColor, endColor, t)
      
      return {
        backgroundColor: `${bgColor}`,
        boxShadow: `0px 0px 6px ${spreadRadius}px rgba(0, 0, 0, 0.12)`
      }
    })

    this.applyAnimatedStyle('.top-wrp', () => {
      'worklet'
      const t = progress.value
      return {
        backgroundColor: `rgb(245, 242, 241, ${1 - t})` 
      }
    })

    this.applyAnimatedStyle('.indicator', () => {
      'worklet'
      const t = progress.value
      return {
        opacity: t
      }
    })

    this.progress = progress
  },

  /**
   * api请求
   */
  async getJobInfo() {
    const info = await request('/api/getMyCV').then((res) => res.data.data);
    return info;
  },

})
