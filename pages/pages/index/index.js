//index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
const db = wx.cloud.database()
const _ = db.command
var app=getApp()
let videoAd = null

wx-Page({


  data: {
    presentmoney: '',
    showModal1:false,
    owhat:'',
    free:false,
    onecost:'',
    showModal1:false,
    ad:'',
  },
  
  
  onLoad: function (options) {
   this.setData({
     onecost: app.globalData.onecost
   })
   
    
   
    this.checkMinaUpdate()
     let m= wx.getStorageSync('presentmoney')
     if(!m){
       wx.showModal({
         title: 'HMH48抽抽抽',
         content: '1.您现在所在页面为常规卡池，可抽取所有卡牌。\n\n2.本程序设有9个馆藏，每个馆藏有一套专属卡牌，收集相应馆藏的卡牌，可解锁此馆藏剧情。\n\n 3.在羁绊板块，您可以消耗卡牌，与HMH48各个人格进行互动，增加羁绊，攻略对象，羁绊达到100可获得专属粉丝称号。羁绊点数无上限。 \n\n4.点击右箭头，前往馆藏限定卡池，每日设有一个当日限定馆藏，此馆藏中卡牌的抽取几率将达到80%，并设有保底，助您有针对性地解锁剧情。\n\n 5.点击左箭头，前往SR,SSR限定卡池,可使用重复卡牌兑换抽卡券，用于抽取SSR和SR卡牌。\n\n 6.请前往“我的”页面登录以开始使用本程序',
         showCancel: false
       })
     }
      this.setData({
        presentmoney:m
      })
    
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-dd17a87bb6ccff6a',
        multition:true
      })
      videoAd.onLoad(() => {console.log("准备视频")})
      videoAd.onError((err) => { console.log("创建失败",err)})
      videoAd.onClose((res) => {
        console.log("closead")
        if (res.isEnded) {
          if(this.data.ad>=10){
            wx.showModal({
              content: '今日观看视频数已达上限',
            })
          }else{
            wx.showLoading({
              title: '成功观看视频，上传数据中',
            })
            let _id = wx.getStorageSync('_id')
            var d = new Date()
            var time = d.toLocaleDateString() + d.toLocaleTimeString();
            db.collection('test').add({
              data:{
                userid:_id,
                time:time
              }
            })
            db.collection('user').doc(_id).update({
              data: {
                presentmoney: _.inc(1)//改
              }
            }).then(res => {
              let presentmoney = wx.getStorageSync('presentmoney')
              wx.setStorageSync('presentmoney', presentmoney + 1)//改
              wx.setStorageSync('ad', this.data.ad+1)
              this.setData({
                presentmoney: presentmoney + 1,
                ad:this.data.ad+1
              })

              wx.hideLoading()
            })
          }
          } else {
          wx.showModal({
            content: '未看完视频，无法获得奖励',
          })
        }}
      )
    }
          
            
          
          
   
    
  },
  ad(){

    let _id=wx.getStorageSync('_id')
    
    if(!_id){
      wx.showModal({
        content: '请先登录',
        showCancel:false
      })
    }else{
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          console.log("失败重新拉取")
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              console.log("拉取失败",err)
              wx.showModal({
                content: '暂时无合适视频,请稍后再试',
              })
            })
        })
      }
      
     
    }
    
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

 

  onHide:function(){
    wx.hideLoading()
  },

  
  onShow:function(){
    let m = wx.getStorageSync('presentmoney')
    this.setData({
      presentmoney: m
    })
      this.setData({
        showModal2: false
      })
   
    var date = new Date()
    var today = date.getDate()
   
    let lastday = wx.getStorageSync('date')
    let addlastday = wx.getStorageSync('addate')
    
    console.log(addlastday,today)
    if (today != lastday) {
      console.log("每日免费",lastday,today)
      this.setData({
        free: true,
      })
    }else{
      console.log("无免费",lastday,today)
    }
    
    if(m&&today!=addlastday){
      this.setData({
       ad: 0,
      })
      wx.setStorageSync('addate', today)
      wx.setStorageSync('ad', 0)
    } else if (today == addlastday){
      let ad=wx.getStorageSync('ad')
      if(!ad){
        console.log("here")
        ad=0
      }
      this.setData({
        ad: ad,
      })
    }

    
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

    let _id=wx.getStorageSync('_id')
    console.log(_id)
    if(!_id){
      wx.showModal({
        content: '请先登录',
        showCancel:false
      })
    }else{
    if(this.data.free){
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      this.setData({
        showModal2: true
      })
      var date = new Date()
      var today = date.getDate()
      this.setData({
        free: false
      })
      wx.setStorageSync('date', today)
      console.log("进行免费抽卡",this.data.free)
      wx.navigateTo({
        url: '/pages/cardshow/index?num=1&type=0&free=1',
      })
      
    }else{
      if (this.data.presentmoney < app.globalData.onecost){

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
        
       
          showModal2: true
        
      })

      wx.navigateTo({
      url: '/pages/cardshow/index?num=1&type=0&free=0',
        events: {
          hasnotfinish: notfinish => {
            console.log("notfinish", notfinish)

            if (notfinish.data) {

              wx.showLoading({
                title: '',
                mask: true
              })
              setTimeout(() => {
                let presentmoney = wx.getStorageSync('presentmoney')
                this.setData({
                  presentmoney: presentmoney
                })
                wx.hideLoading()
              }, 3000)

            }
          }
        }
      })
        
      }
    }
    }
  },

  chouten() {
    let _id = wx.getStorageSync('_id')
    if (!_id) {
      wx.showModal({
        content: '请先登录',
        showCancel: false
      })
    } else {
    if (this.data.presentmoney < 10 * app.globalData.onecost) {

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
        
        showModal2: true
      })

      wx.navigateTo({

        url: '/pages/cardshow/index?num=10&type=0&free=0',
        events: {
          hasnotfinish: notfinish => {
            console.log("notfinish", notfinish)

            if (notfinish.data) {

              wx.showLoading({
                title: '',
                mask: true
              })
              setTimeout(() => {
                let presentmoney = wx.getStorageSync('presentmoney')
                this.setData({
                  presentmoney: presentmoney
                })
                wx.hideLoading()
              }, 3000)

            }
          }
        }
      })
    }
    }
  },

  

  refresh(){
    

    let mypresentmoney=wx.getStorageSync('presentmomney')
    let mychargemoney = wx.getStorageSync('chargemoney')
    let _id=wx.getStorageSync("_id")
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
      presentmoney:true,
      chargemoney:true
      }).get().then(res=>{
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      console.log("更新钱",res)
      this.setData({
        presentmoney:res.data.presentmoney
      })
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        wx.showModal({
          content: '玩家们太热情了TTTT！由于服务器压力，今日全服刷新总数已达上限，请明日再来~',
          showCancel: false,
        })
      })
    }
  },
  question(){
    wx.showModal({
      content: '1.您现在所在页面为常规卡池，可抽取所有卡牌。抽取机率为： SSR:' + app.globalData.prossr + ', SR：' + app.globalData.prosr + '，R:' + app.globalData.pror + '。\n\n 2.本程序设有9个馆藏，每个馆藏有一套专属卡牌，收集相应馆藏的卡牌，可解锁此馆藏剧情。\n\n3.在羁绊板块，您可以消耗卡牌，与HMH48各个人格进行互动，增加羁绊，攻略对象，羁绊达到100可获得专属粉丝称号。羁绊点数无上限。 \n\n4.点击右箭头，前往馆藏限定卡池，每日设有一个当日限定馆藏，此馆藏中卡牌的抽取几率将达到80%，并设有保底，助您有针对性地解锁剧情。\n\n 5.点击左箭头，前往SR,SSR限定卡池,可使用重复卡牌兑换抽卡券，用于抽取SSR和SR卡牌。',
      showCancel:false
    })
  },
 
  onegroup(){
    wx.showLoading({
      title: '正在跳转...',
      mask: true
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
   
    wx.navigateTo({
      url: '/pages/ssrgroup/index',
    })
  }
  
})