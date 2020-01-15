// pages/user/index.js
const db = wx.cloud.database()
const _ = db.command
var app = getApp()
Page({

 
  data: {
    chargemoney:'',
    input:'',
    owhatid:'',
    setid:'',
    log:"",
    showModal1: false,
    date:'',
    ad:'',
    addate:'',

  },

  
  onLoad: function (options) {
    
    let mychargemoney=wx.getStorageSync('chargemoney')
    let myowhatid = wx.getStorageSync('owhatid')
    if(myowhatid){
      this.setData({
        log:"退出"
      })
    }else{
      this.setData({
        log: "登录"
      })
    }
    this.setData({
      chargemoney: mychargemoney,
      owhatid:myowhatid
    })
  },
  onShow() {
  
    let mychargemoney = wx.getStorageSync('chargemoney')
    let myowhatid = wx.getStorageSync('owhatid')
    this.setData({
      chargemoney: mychargemoney,
      owhatid: myowhatid
    })
  },
  getuserinfo(e){
    console.log(e)
    if(e.detail.cloudID){
      wx.showModal({
        content: '已授权，请登录',
        showCancel:false
      })
    }
  },
  go: function () {//正式版改逻辑,新建账号在这里
    
    
    let my_id = wx.getStorageSync('_id')
    if(!my_id){
      wx.showModal({
        content: '请先登录',
        showCancel:false
      })
    }else{
      wx.showLoading({
        title: '更新ID中',
        mask: true
      })
    let mowhatid = this.data.input
    var mychargemoney = wx.getStorageSync('chargemoney')
    var mypresentmoney = wx.getStorageSync('presentmoney')
    wx.cloud.callFunction({
      name:"changeowhatid",
      data:{
        owhatid:mowhatid,
        _id:my_id
      },
      
    }).then(res=>{
      console.log("云端更换owhatid",res)
      var chargemoneyplus=res.result.chargemoneyplus
      if(chargemoneyplus==-1){
        wx.hideLoading()
        wx.showModal({
          content: '该id已被绑定',
          showCancel:false
        })
      }else {
      wx.setStorageSync('owhatid', mowhatid)
      wx.setStorageSync('presentmoney', mypresentmoney + chargemoneyplus)
      this.setData({
        chargemoney: mychargemoney + chargemoneyplus,
        owhatid: mowhatid
      })
      wx.setStorageSync('chargemoney', mychargemoney + chargemoneyplus)
      wx.hideLoading()
      }
      }).catch(err=>{
        wx.hideLoading()
        wx.showModal({
          content: '玩家们太热情了TTTT！由于服务器压力，今日全服注册总数已达上限，请明日再来~',
          showCancel: false,
          success(res) {

            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      })
    }
  },

  ok(event) {
    this.setData({
      input: parseInt(event.detail.value)
    })
  },
  refresh() {
    
    var mypresentmoney = wx.getStorageSync('presentmomney')
    var mychargemoney = wx.getStorageSync('chargemoney')
    let _id = wx.getStorageSync("_id")
    if(!_id){
      wx.showModal({
        content: '请先登录',
        showCancel:false
      })
    }else{
    wx.showLoading({
      title: '更新数据中',
      mask: true
    })
    db.collection('user').doc(_id).field({
      presentmoney: true,
      chargemoney: true
    }).get().then(res => {
     
      console.log("更新钱",res)
      this.setData({
        chargemoney: res.data.chargemoney
      })
     
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        wx.showModal({
          content: '玩家们太热情了TTTT！由于服务器压力，今日全服更新总数已达上限，请明日再来~',
          showCancel: false,
          
        })
      })
    
    }
  },
  logout(){
    if(this.data.log=="退出"){
      wx.showModal({
        content: '退出后将清除所有缓存数据，确定退出？',
        success:(res)=> {
          if (res.confirm) {
            let date = wx.getStorageSync('date')
            let ad = wx.getStorageSync('ad')
            let addate=wx.getStorageSync('addate')
           
            wx.clearStorageSync()
            this.setData({
              chargemoney: 0,
              owhatid: "",
              log: "登录",
              date: date,
              ad:ad,
              addate:addate,
          

            })
          }
        }
      })
      
    }else{
      wx.getSetting({
        success:res=> {
          console.log(res.authSetting['scope.userInfo'])
          if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              
              content: '请先点击授权按钮进行授权',
              showCancel: false,
            })
            
          }else{
            wx.showLoading({
              title: '正在初始化...',
              mask: true
            })
            wx.cloud.callFunction({
              // name: "initilal",
              name: "initial2",
              ///体验版改！
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
              wx.setStorageSync('ticket', data.user.ticket)
              wx.setStorageSync('times', data.user.times)
              wx.setStorageSync('love', data.user.love)
              wx.setStorageSync('card_ssr', data.card_ssr)
              wx.setStorageSync('card_sr', data.card_sr)
              wx.setStorageSync('card_r', data.card_r)
              wx.setStorageSync('card_all', card_all)
              wx.setStorageSync('new', false)
              wx.setStorageSync('date', this.data.date)
              wx.setStorageSync('addate', this.data.addate)
              
              wx.setStorageSync('ad', this.data.ad)
              wx.setStorageSync('newstory', [])              
              wx.setStorageSync('lovecontext', data.lovecontext)
              let story = data.story
              wx.setStorageSync('story', story)
              for (let i = 0; i < story.length; i++) {
                wx.setStorageSync(story[i]._id + 'story', story[i].data)
              }
              let progress = data.user.progress
              wx.setStorageSync('progress', progress)
              wx.setStorageSync('春卷progress', progress.春卷)
              wx.setStorageSync('昊昊progress', progress.昊昊)
              wx.setStorageSync('萱萱progress', progress.萱萱)
              wx.setStorageSync('妙妙progress', progress.妙妙)
              wx.setStorageSync('小佳寺町progress', progress.小佳寺町)
              wx.setStorageSync('小瓜皮progress', progress.小瓜皮)
              wx.setStorageSync('佳佳progress', progress.佳佳)
              wx.setStorageSync('豪豪progress', progress.豪豪)
              wx.setStorageSync('昊哥progress', progress.昊哥)

              
              wx.hideLoading()
              this.relateowhatid()

            }).catch(err => {
              console.log(err)
              wx.hideLoading()
              wx.showModal({
                content: '玩家们太热情了TTTT！由于服务器压力，今日全服注册总数已达上限，请明日再来~',
                showCancel: false,
              
              })
            })
          }
        }
      })
      
    }
    
  },
  preventTouchMove: function () {
  },

  go2: function () {
    //正式版改逻辑,新建账号在这里


    let id = wx.getStorageSync('_id')
    let mowhatid = this.data.setid
    if (!mowhatid) {
      wx.showModal({

        content: '请输入账号',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '',
        mask: true
      })
      var mychargemoney = wx.getStorageSync('chargemoney')
      var mypresentmoney = wx.getStorageSync('presentmoney')
      

      wx.cloud.callFunction({
        name: "changeowhatid",
        data: {
          _id: id,
          owhatid: mowhatid
        },


      }).then(res => {
        console.log("读写owhatid", res)
        var chargemoneyplus = res.result.chargemoneyplus
        wx.hideLoading()
        if (chargemoneyplus == -1) {
          wx.showModal({
            content: '该id已被绑定',
            showCancel: false,
          })
        } else {
          wx.setStorageSync('owhatid', mowhatid)
          wx.setStorageSync('presentmoney', mypresentmoney + chargemoneyplus)
          this.setData({
            chargemoney: chargemoneyplus,
            owhatid: mowhatid,
            showModal1: false,
            log:"退出"
          })
          wx.setStorageSync('chargemoney', mychargemoney + chargemoneyplus)
          console.log("读写owhatid成功")
          wx.hideLoading()
          
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showModal({
          content: '玩家们太热情了TTTT！由于服务器压力，今日全服注册总数已达上限，请明日再来~',
          showCancel: false,
        })
      })
    }
  },

  ok2(event) {
    this.setData({
      setid: parseInt(event.detail.value)
    })
  },
  relateowhatid() {
    let owhatid = wx.getStorageSync('owhatid')
   
    if (!owhatid) {
      wx.hideLoading()
      this.setData({
        showModal1: true,
      })
    } else {
      let chargemoney = wx.getStorageSync('chargemoney')
      this.setData({
        owhatid:owhatid,
        chargemoney:chargemoney,
        log:"退出"
      })
    }
  },
  go3(){
    this.setData({
      showModal1:false
    })
    wx.clearStorageSync()
  }
  
})