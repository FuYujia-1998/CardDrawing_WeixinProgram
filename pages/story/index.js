// pages/achievement/index.js
const db = wx.cloud.database()
const _ = db.command

Page({

 
  data: {
    menu: [["春卷",""], ["昊昊","chili"], ["萱萱","贾四艇"], ["妙妙","贾跳舞"], ["小佳寺町","黄sir"], ["小瓜皮","小驼"], ["佳佳","豪仔"], ["黄姐","豪哥"], ["昊哥","豪豪"]],
    news: [false, false, false, false, false, false, false, false, false]
  },

  onLoad: function (options) {
    
   
   
  },
  onShow:function(){
    wx.hideTabBarRedDot({
      index: 2,
    })
    
    let newstory=wx.getStorageSync('newstory')
    let news=this.data.news
    console.log(newstory)
    if (newstory.includes("春卷")){news[0]=true}
    if (newstory.includes("昊昊")) { news[1] = true }
    if (newstory.includes("萱萱")) { news[2] = true }
    if (newstory.includes("妙妙")) { news[3] = true }
    if (newstory.includes("小佳寺町")) { news[4] = true }
    if (newstory.includes("小瓜皮")) { news[5] = true }
    if (newstory.includes("佳佳")) { news[6] = true }
    if (newstory.includes("黄姐")) { news[7] = true }
    if (newstory.includes("昊哥")) { news[8] = true }
    this.setData({
      news:news
    })
  },
  onHide: function () {
    wx.hideLoading()
  },

  handleitem(e){
    
    var { name1 }=e.currentTarget.dataset
    var { name2 } = e.currentTarget.dataset
    var { index } = e.currentTarget.dataset
    let news=this.data.news
    news[index]=false
    this.setData({
      news:news
    })
    let newstory = wx.getStorageSync('newstory')
    if(index==0){
      let a = newstory.indexOf("春卷")
      
      newstory.splice(a,1)
     
      wx.setStorageSync('newstory', newstory)
    } else if (index == 1) {
      let a = newstory.indexOf("昊昊")
     
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index == 2) {
      let a = newstory.indexOf("萱萱")
      
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index == 3) {
      let a = newstory.indexOf("妙妙")
      
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index == 4) {
      let a = newstory.indexOf("小佳寺町")
      
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index == 5) {
      let a = newstory.indexOf("小瓜皮")
      
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index ==6) {
      let a = newstory.indexOf("佳佳")
      
        newstory.splice(a, 1)
       
      wx.setStorageSync('newstory', newstory)
    } else if (index == 7) {
      let a = newstory.indexOf("黄姐")
      
        newstory.splice(a, 1)
        
      wx.setStorageSync('newstory', newstory)
    } else if (index == 8) {
      let a = newstory.indexOf("昊哥")
      
        newstory.splice(a, 1)
       
      wx.setStorageSync('newstory', newstory)
    }
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    })
    wx.navigateTo({
      url: '/pages/onestory/index?name1='+name1+'&name2='+name2,
    })
  },
    
})