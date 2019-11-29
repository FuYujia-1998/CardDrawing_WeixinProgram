//index.js
const db = wx.cloud.database()
const _ = db.command
var app=getApp()
wx-Page({


  data: {
    presentmoney: '',
    showModal1:false,
    owhat:''
  },

  
  onLoad: function (options) {
    this.relateowhatid();
    this.getuserinfo();
    
  },
  relateowhatid(){
    let owhatid = wx.getStorageSync('owhatid')
    if(!owhatid){
        wx.hideLoading()
        this.setData({
        showModal1: true,
      })
    }
  },

  onHide:function(){

    wx.hideLoading()
  },
  getuserinfo(){
       let money = wx.getStorageSync('presentmoney')
    if (!money) {

      wx.showLoading({
        title: '正在初始化...',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'getuserinfo',
        data: {
          money: app.globalData.originmoney
        }
      }).then(res => {
        console.log(res)
        if(!res.result.has){
          console.log("云端新用户注册账户")
          money = app.globalData.originmoney
          wx.setStorageSync('chargemoney', 0)
          wx.setStorageSync('presentmoney',app.globalData.originmoney)
          wx.setStorageSync('mycard',[])
          wx.setStorageSync('_id', res.result._id)
          wx.setStorageSync('openid', res.result.openid)
          
        }else{
          let data=res.result.data[0]
          money=data.presentmoney
          wx.setStorageSync('chargemoney', data.chargemoney)
          wx.setStorageSync('presentmoney', data.presentmoney)
          wx.setStorageSync('mycard', data.card)
          wx.setStorageSync('_id', data._id)
          wx.setStorageSync('openid', data._openid)
          wx.setStorageSync('owhatid', data.owhatid)
          console.log("云端老用户读取账户")
         
        }   
        this.setData({
          presentmoney: money
        })
        wx.hideLoading()
      })
    }else{
      this.setData({
        presentmoney: money
      })
      console.log("用户信息已储存")
    }
    
  },
  onShow:function(){
    let m= wx.getStorageSync('presentmoney')
      this.setData({
        presentmoney:m
      })
     
  },
  chouone(){
    
    
    if(this.data.presentmoney<=0){
      wx.showModal({
          content: '余额不足',
          showCancel:false,
      })
    }else{
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      this.setData({
        presentmoney: this.data.presentmoney - 1
      })
      wx.navigateTo({
      url: '/pages/cardshow/index?num=1',})
      }
  },
  chouten() {
   
    if (this.data.presentmoney < 10) {
      wx.showModal({
        content: '余额不足',
        showCancel: false,
      })
    } else {
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      this.setData({
        presentmoney: this.data.presentmoney-10
      })
      wx.navigateTo({

        url: '/pages/cardshow/index?num=10',
      })
    }
  },
  preventTouchMove: function () {
  },

  show2(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    const { index } = e.currentTarget.dataset
    let mysrc = this.data.src
    mysrc[index] = this.data.randcard[index].src
    this.setData({
      showModal1: true,
      currentsrc: this.data.randcard[index].src,
      src: mysrc,
    })
  },


  go: function () {//正式版改逻辑,新建账号在这里
    wx.showLoading({
      title: '',
      mask: true
    })
    let id = wx.getStorageSync('_id')
    let mowhatid = this.data.owhatid
    var mychargemoney = wx.getStorageSync('chargemoney')
    var mypresentmoney = wx.getStorageSync('presentmoney')
    wx.setStorageSync('owhatid', mowhatid)
    wx.cloud.callFunction({
      name:"changeowhatid",
      data:{
        _id:id,
        owhatid:mowhatid
      }
    }).then(res=>{
      var chargemoneyplus = res.result.chargemoneyplus
      wx.setStorageSync('owhatid', mowhatid)
      wx.setStorageSync('presentmoney', mypresentmoney + chargemoneyplus)
      this.setData({
        presentmoney: mypresentmoney + chargemoneyplus,
        owhatid: mowhatid,
        showModal1:false
      })
      wx.setStorageSync('chargemoney', mychargemoney + chargemoneyplus)
      wx.hideLoading()
    })
  },

  ok(event) {
    console.log("here")
    this.setData({
      owhatid: parseInt(event.detail.value)
    })
    console.log(this.data.owhatid)
  },
  refresh(){
    wx.showLoading({
      title: '更新数据中',
      mask:true
    })
    let mypresentmoney=wx.getStorageSync('presentmomney')
    let mychargemoney = wx.getStorageSync('chargemoney')
    let _id=wx.getStorageSync("_id")
    db.collection('user').doc(_id).get().then(res=>{
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      console.log(res)
      this.setData({
        presentmoney:res.data.presentmoney
      })
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.hideLoading()
    })
  }
})