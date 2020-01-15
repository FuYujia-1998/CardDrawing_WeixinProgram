// pages/oengroup/index.js
const db = wx.cloud.database()
const _ = db.command
var app=getApp()
const group = [["昊哥", "黄sir"],["小瓜皮", "贾四艇"],  ["萱萱", "小驼"], ["小佳寺町", "黄姐"], ["豪豪", "豪哥"],["春卷", ""], ["昊昊", "chili"], ["佳佳", "豪仔"], ["妙妙", "贾跳舞"]]
const src = ["http://i1.fuimg.com/636741/00f74ea746baa80e.png","http://i1.fuimg.com/636741/74faa3fb6e1e9f1c.png",
  "http://i1.fuimg.com/636741/56eb78e787f0bd4e.png",
  "http://i1.fuimg.com/636741/bb3845e95255679e.png",
  "http://i1.fuimg.com/636741/4789559db5fbebb6.png",
  "http://i1.fuimg.com/636741/da23ae6bafa82e8e.png",
  "http://i1.fuimg.com/636741/0e2961b01fbb4ca4.png",
  "http://i1.fuimg.com/636741/1d842eaaf2202fc0.png",
  "http://i1.fuimg.com/636741/b12382bef03ae33a.png",
  
  
  
  ]
Page({

 
  data: {
    presentmoney: '',
    charactor:'',
    free:false,
    src:'',
    loading:true,
    onecost:'',
    showModal1:false,
    
  },

  
  onLoad: function (options) {
    let m = wx.getStorageSync('presentmoney')
   
    this.setData({
      presentmoney: m,
      onecost: app.globalData.onecost
    })
    var date=new Date()
    var today=date.getDate()
    let lastday=wx.getStorageSync('date')
   
    if(today!=lastday){
      console.log("每日免费",lastday,today)
      this.setData({
        free:true
      })
    }else{
      console.log("无免费", lastday, today)
    }
    
   
   
      
    var index = today% group.length
    var charactor = group[index]
    console.log("今日限定成员", index, charactor)
    this.setData({
      src:src[index],
      charactor: charactor
    })
   
    wx.setNavigationBarTitle({
      title: charactor[0] + (charactor[1] ? " & " : "") + charactor[1] + "馆专属卡池",
    })
    
  },

  onShow: function () {
    let m = wx.getStorageSync('presentmoney')
    this.setData({
      presentmoney: m,
      showModal1:false
    })
    let news = wx.getStorageSync('news')
    if (news) {
      wx.showModal({
        content: "恭喜你解锁了新剧情！快去看看吧~",
        showCancel: false,

      })}
  },

  rule(){
    
    wx.showModal({
      content: '1.馆藏限定卡池中，抽到此馆成员卡牌的概率提升至80%。\n\n 2.本馆设有保底机制，若在本馆抽卡超过100次，仍未集齐本馆成员所有卡牌，则接下来的抽卡将自动为您抽选本馆卡牌。\n\n 3.限定馆每日轮换。',
      showCancel:false
    })
  },
  chouone() {
    let _id = wx.getStorageSync('_id')
    console.log(_id)
    if (!_id) {
      wx.showModal({
        content: '请先登录',
        showCancel: false
      })
    } else {
    if (this.data.free) {
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      this.setData({
        free: false,
        showModal1:true
      })
      var date = new Date()
      var today = date.getDate()
      wx.setStorageSync('date', today)
      let name1 = this.data.charactor[0]
      let name2 = this.data.charactor[1]
      wx.navigateTo({
        url: '/pages/cardshow/index?num=1&type=1&free=1&name1=' + name1 + '&name2=' + name2,
        
      })
      
    }else{

      if (this.data.presentmoney < app.globalData.onecost) {

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
        
        showModal1: true
      })
      let name1 = this.data.charactor[0]
      let name2 = this.data.charactor[1]
      
      wx.navigateTo({
        url: '/pages/cardshow/index?num=1&type=1&free=0&name1=' + name1 + '&name2=' + name2,
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

  onHide: function () {
    wx.hideLoading()
  },

  chouten() {
    let _id = wx.getStorageSync('_id')
    console.log(_id)
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
       
        showModal1: true
      })
      let name1=this.data.charactor[0]
      let name2=this.data.charactor[1]
      wx.navigateTo({

        url: '/pages/cardshow/index?num=10&type=1&free=0&name1=' + name1 + '&name2=' + name2,
        events: {
          hasnotfinish: notfinish => {
            console.log("notfinish", notfinish)

            if (notfinish.data) {

              wx.showLoading({
                title: '',
                mask: true
              })
              setTimeout(() => {
                console.log("here")
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

  load(){
    this.setData({
      loading:false
    })
  },

  refresh() {
   

    
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
      wx.setStorageSync('presentmoney', res.data.presentmoney)
      console.log(res)
      this.setData({
        presentmoney: res.data.presentmoney
      })
      wx.setStorageSync('chargemoney', res.data.chargemoney)
      wx.hideLoading()
    })
    }
  },
  preventTouchMove(){

  }

})