// utils/cloud.js
/**
 * 获取云存储文件的 HTTPS 链接
 * @param {string} cloudPath - cloud:// 开头的路径
 * @returns {Promise<string>} 可直接使用的 HTTPS 链接
 */
export async function getCloudImgUrl(cloudPath) {
  try {
    const res = await wx.cloud.getTempFileURL({
      fileList: [cloudPath],
    });
    if (res.fileList && res.fileList[0].tempFileURL) {
      return res.fileList[0].tempFileURL;
    } else {
      throw new Error('获取临时链接失败');
    }
  } catch (err) {
    console.error('getCloudImgUrl error:', err);
    return '';
  }
}
