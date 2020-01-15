// pages/trace/index.js
Page({


  data: {
    item: ['春卷', '昊昊', '佳佳', '妙妙', '昊哥', '萱萱', '小佳寺町', '小瓜皮', '豪豪', 'chili', '豪仔', '贾跳舞', '黄sir', '小驼', '黄姐', '贾四艇', '豪哥'],
    love:''
  },

  onLoad: function (options) {
   let love= wx.getStorageSync('love')
   this.setData({
     love:love
   })
  },
  onShow(){
    let love = wx.getStorageSync('love')
    this.setData({
      love: love
    })
  },
 go(e){
   var { item } = e.currentTarget.dataset
   wx.navigateTo({
     url: '/pages/love/index?name='+item,
   })
 }
})