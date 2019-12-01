// pages/user/index.js
const db = wx.cloud.database()
const _ = db.command
Page({

 
  data: {
    chargemoney:'',
    input:'',
    owhatid:'',
  },

  
  onLoad: function (options) {
    let mychargemoney=wx.getStorageSync('chargemoney')
    let myowhatid = wx.getStorageSync('owhatid')
    this.setData({
      chargemoney: mychargemoney,
      owhatid:myowhatid
    })
  },
  onShow(){
    let mychargemoney = wx.getStorageSync('chargemoney')
    let myowhatid = wx.getStorageSync('owhatid')
    this.setData({
      chargemoney: mychargemoney,
      owhatid: myowhatid
    })
  },
  
  go: function () {//正式版改逻辑,新建账号在这里
    wx.showLoading({
      title: '',
      mask: true
    })
    let my_id = wx.getStorageSync('_id')
    let mowhatid = this.data.input
    var mychargemoney = wx.getStorageSync('chargemoney')
    var mypresentmoney = wx.getStorageSync('presentmoney')
    wx.cloud.callFunction({
      name:"changeowhatid",
      data:{
        owhatid:mowhatid,
        _id:my_id
      }
    }).then(res=>{
      console.log("plus",res)
      var chargemoneyplus=res.result.chargemoneyplus
      wx.setStorageSync('owhatid', mowhatid)
      wx.setStorageSync('presentmoney', mypresentmoney + chargemoneyplus)
      this.setData({
        chargemoney: mychargemoney + chargemoneyplus,
        owhatid: mowhatid
      })
      wx.setStorageSync('chargemoney', mychargemoney + chargemoneyplus)
      wx.hideLoading()
    })
  },

  ok(event) {
    this.setData({
      input: parseInt(event.detail.value)
    })
  },
  refresh() {
    wx.showLoading({
      title: '更新数据中',
      mask: true
    })
    var mypresentmoney = wx.getStorageSync('presentmomney')
    var mychargemoney = wx.getStorageSync('chargemoney')
    let _id = wx.getStorageSync("_id")
    db.collection('user').doc(_id).field({
      presentmoney: true,
      chargemoney: true
    }).get().then(res => {
     
      console.log(res)
      this.setData({
        chargemoney: res.data.chargemoney
      })
     
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      wx.hideLoading()
    })
    
   
  }
    
  
})