// pages/ssrgroup/index.js
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    ticket: '',
    src: '',
    loading: true,
    showModal1:false
  },


  onLoad: function (options) {
    let ticket = wx.getStorageSync('ticket')
    console.log("抽卡券张数", ticket)
    this.setData({
      ticket: ticket
    })
    

  },
 
  onShow: function () {
   
    let ticket = wx.getStorageSync('ticket')
   
    this.setData({
      ticket: ticket
    })
    this.setData({
      showModal1: false
    })

    let news = wx.getStorageSync('news')
    if (news) {
      wx.showModal({
        content: "恭喜你解锁了新剧情！快去看看吧~",
        showCancel: false,

      })
    }
  },

  rule() {

    wx.showModal({
      content: "1.SSR,SR限定卡池中，仅出SSR,SR卡牌,两者概率比例为 3:7 。\n\n 2.五张抽卡券可抽一次卡，抽卡券可由卡牌兑换。",
      showCancel: false
    })
  },
  

  onHide: function () {
    wx.hideLoading()
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
    if (this.data.ticket < 5) {

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
       
        showModal1:true
      })
      
      wx.navigateTo({

        url: '/pages/cardshow/index?num=1&type=2&free=0',
        events:{hasnotfinish: notfinish=> {
          console.log("notfinish",notfinish)
          
          if(notfinish.data){
            
            wx.showLoading({
              title: '',
              mask:true
            })
            setTimeout(()=>{
              let ticket =wx.getStorageSync('ticket')
              this.setData({
                ticket:ticket
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

  load() {
    this.setData({
      loading: false
    })
  },
  change(){
    wx.navigateTo({
      url: '/pages/change/index',
    })
  },
  preventTouchMove() {

  }

})