// pages/ssrgroup/index.js
const db = wx.cloud.database()
const _ = db.command
const group = [["春卷", ""], ["昊昊", "chili"], ["萱萱", "贾四艇"], ["妙妙", "贾跳舞"], ["小佳寺町", "黄sir"], ["小瓜皮", "小驼"], ["佳佳", "豪仔"], ["黄姐", "豪哥"], ["昊哥", "豪豪"]]
const src = ["cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_chunjuanzipai.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_haohaodengnifangxue.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_xuandaiwa.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_miaochuangzhao.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_xiaojiasitingzipai.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_xiaoguapicongming.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_jiajiashucha.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_huangjieqqai.jpg",
  "cloud://hmh48-j2coo.686d-hmh48-j2coo-1300630698/story/chengjiu_haogeyanshenxili.jpg"]
Page({
  data: {
    presentmoney: '',
    charactor: '',
    free: false,
    src: '',
    loading: true
  },


  onLoad: function (options) {
    var date = new Date()
    var today = date.getDate()
    let lastday = wx.getStorageSync('date')

    if (today != lastday) {
      this.setData({
        free: true
      })

    }

    let index = today % group.length
    let charactor = group[index]
    this.setData({
      charactor: charactor,
      src: src[index]
    })
    wx.setNavigationBarTitle({
      title: charactor[0] + (charactor[1] ? " & " : "") + charactor[1] + "馆限定卡池",
    })

  },

  onShow: function () {
    let m = wx.getStorageSync('presentmoney')
    this.setData({
      presentmoney: m
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
      content: '限定馆藏专属卡池中，抽到限定馆卡牌的概率提升至60%，十连抽无保底。限定馆每日一换。',
      showCancel: false
    })
  },
  chouone() {
    if (this.data.free) {
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      })
      this.setData({
        free: false
      })
      var date = new Date()
      var today = date.getDate()
      wx.setStorageSync('date', today)
      wx.navigateTo({
        url: '/pages/cardshow/index?num=1&type=1&free=1& name1=' + name1 + '& name2=' + name2,
      })

    } else {

      if (this.data.presentmoney < 2) {

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
          presentmoney: this.data.presentmoney - 2
        })
        let name1 = this.data.charactor[0]
        let name2 = this.data.charactor[1]
        wx.navigateTo({
          url: '/pages/cardshow/index?num=1&type=1&free=0&name1=' + name1 + '&name2=' + name2,
        })
      }
    }
  },

  onHide: function () {
    wx.hideLoading()
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
        presentmoney: this.data.presentmoney - 20
      })
      let name1 = this.data.charactor[0]
      let name2 = this.data.charactor[1]
      wx.navigateTo({

        url: '/pages/cardshow/index?num=10&type=1&free=0&name1=' + name1 + '&name2=' + name2,
      })

    }
  },

  load() {
    this.setData({
      loading: false
    })
  },

  refresh() {
    wx.showLoading({
      title: '更新数据中',
      mask: true
    })


    let _id = wx.getStorageSync("_id")

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
  },


})