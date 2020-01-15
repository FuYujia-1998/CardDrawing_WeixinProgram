// pages/onecard/index.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    num:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      src:options.src,
      num:options.num
    }
     
    )
    wx.showLoading({
      title: '',
      mask: true
    })
   
  },
  load(){
   wx.hideLoading()
  }, 
  preview() {
    console.log("here")
    wx.previewImage({
      current: this.data.src, // 当前显示图片的http链接
      urls: [this.data.src]
    })
  }

 
 

 

})