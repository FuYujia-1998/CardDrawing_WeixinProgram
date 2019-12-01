//index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
const db = wx.cloud.database()
const _ = db.command
var app=getApp()


wx-Page({


  data: {
    presentmoney: '',
    showModal1:false,
    showModal2:false,
    owhat:'',
    free:false
  },
  
  
  onLoad: function (options) {

    this.initial();
    this.checkMinaUpdate()
    
  },

  checkMinaUpdate () {

    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log('update', res.hasUpdate)
    })

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(() => {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },


  initial() {

    let _openid = wx.getStorageSync('_openid')

    if (!_openid) {
      wx.showLoading({
        title: '正在初始化...',
        mask: true
      })
      wx.cloud.callFunction({

        name: "initilal",
        data: {
          originmoney: app.globalData.originmoney
        }

      }).then(res => {
        

        console.log("读取用户数据", res.result.data)
        let data = res.result.data
        this.setData({
          presentmoney: data.user.presentmoney
        })
       
        
        let card_all = data.card_ssr.concat(data.card_sr, data.card_r)
        wx.setStorageSync('_id', data.user._id)
        wx.setStorageSync('_openid', data.user._openid)
        wx.setStorageSync('presentmoney', data.user.presentmoney)
        wx.setStorageSync('chargemoney', data.user.chargemoney)
        wx.setStorageSync('mycard', data.user.card)
        wx.setStorageSync('owhatid', data.user.owhatid)
        wx.setStorageSync('card_ssr', data.card_ssr)
        wx.setStorageSync('card_sr', data.card_sr)
        wx.setStorageSync('card_r', data.card_r)
        wx.setStorageSync('card_all', card_all)
        wx.setStorageSync('new',false)
        wx.setStorageSync('date', 0)
        wx.setStorageSync('newstory', [])
        let story = data.story
        for (let i = 0; i < story.length; i++) {
          wx.setStorageSync(story[i]._id+'story', story[i].data)
        }
        let progress = data.user.progress
        wx.setStorageSync('春卷progress', progress.春卷)
        wx.setStorageSync('昊昊progress', progress.昊昊)
        wx.setStorageSync('萱萱progress', progress.萱萱)
        wx.setStorageSync('妙妙progress', progress.妙妙)
        wx.setStorageSync('小佳寺町progress', progress.小佳寺町)
        wx.setStorageSync('小瓜皮progress', progress.小瓜皮)
        wx.setStorageSync('佳佳progress', progress.佳佳)
        wx.setStorageSync('黄姐progress', progress.黄姐)
        wx.setStorageSync('昊哥progress', progress.昊哥)
        this.relateowhatid();
        wx.hideLoading()
        
      })

    } else {
      console.log("用户信息已储存")
      let m = wx.getStorageSync('presentmoney')
      this.setData({
        presentmoney: m
      })
      this.relateowhatid();
    }

  },

  
  relateowhatid(){
    let owhatid = wx.getStorageSync('owhatid')
    if(!owhatid){
        wx.hideLoading()
        this.setData({
        showModal1: true,
      })
    }else{
      console.log("owahtid已储存")
    }
  },

  onHide:function(){
    wx.hideLoading()
  },

  
  onShow:function(){
    var date = new Date()
    var today = date.getDate()
    let lastday = wx.getStorageSync('date')
    console.log("lastday",lastday,"today",today)
    if (today != lastday) {
      this.setData({
        free: true
      })
     
    }
    let m= wx.getStorageSync('presentmoney')
      this.setData({
        presentmoney:m
      })
    let news= wx.getStorageSync('news')
    if(news){
      wx.showModal({
        content: "恭喜你解锁了新剧情！快去看看吧~",
        showCancel:false,
      
        success(res){
          wx.setStorageSync('news', false)
        }
      })
      wx.showTabBarRedDot({
        index: 2,
      })

      
    }
    
  },

  chouone(){
    if(this.data.free){
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      var date = new Date()
      var today = date.getDate()
      this.setData({
        free: false
      })
      wx.setStorageSync('date', today)
      console.log("chouwan",today)
      wx.navigateTo({
        url: '/pages/cardshow/index?num=1&type=0&free=1',
      })
      
    }else{
    if(this.data.presentmoney<2){

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
        presentmoney: this.data.presentmoney - 2
      })

      wx.navigateTo({
      url: '/pages/cardshow/index?num=1&type=0&free=0',})
      }
    }
  },

  chouten() {
    if (this.data.presentmoney < 20) {

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
        presentmoney: this.data.presentmoney-20
      })

      wx.navigateTo({

        url: '/pages/cardshow/index?num=10&type=0&free=0',
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


  go: function () {
    //正式版改逻辑,新建账号在这里
    

    let id = wx.getStorageSync('_id')
    let mowhatid = this.data.owhatid
    if(!mowhatid){
      wx.showModal({
       
        content: '请输入账号',
        showCancel:false
      })
    }else{
      wx.showLoading({
        title: '',
        mask: true
      })
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
      console.log("读写owhatid")
      wx.hideLoading()
    })
    }
  },

  ok(event) {
    this.setData({
      owhatid: parseInt(event.detail.value)
    })
  },

  refresh(){
    wx.showLoading({
      title: '更新数据中',
      mask:true
    })

    let mypresentmoney=wx.getStorageSync('presentmomney')
    let mychargemoney = wx.getStorageSync('chargemoney')
    let _id=wx.getStorageSync("_id")

    db.collection('user').doc(_id).field({
      presentmoney:true,
      chargemoney:true
      }).get().then(res=>{
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      console.log(res)
      this.setData({
        presentmoney:res.data.presentmoney
      })
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.hideLoading()
    })
  },

  change(){
    this.setData({
      showModal2:true
    })
  },
  go2(){
    this.setData({
      showModal2:false
    })
  },
  onegroup(){
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    })
    this.setData({
      showModal2: false
    })
    wx.navigateTo({
      url: '/pages/onegroup/index',
    })
  },
  ssrgroup() {
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    })
    this.setData({
      showModal2: false
    })
    wx.navigateTo({
      url: '/pages/ssrgroup/index',
    })
  }
})