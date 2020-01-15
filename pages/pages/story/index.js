// pages/achievement/index.js
const db = wx.cloud.database()
const _ = db.command

Page({

 
  data: {
    menu: '',
    news: [false, false, false, false, false, false, false, false, false],
    progress:[],
    login:false
  },
  story:[],
  onLoad: function (options) {
    this.story=wx.getStorageSync('story')
    if(this.story){
      this.setData({
        login: true
      })
    }
    try {
    let menu=this.story.map(item=>item.title)
    
      this.setData({
        menu: menu
      })
      console.log(menu)
    }catch(err){
      wx.showModal({
        content: '请先登录',
        showCancel:false
      })
    }
    
  },
  onShow:function(){
    this.story = wx.getStorageSync('story')
    if (this.story) {
      this.setData({
        login: true
      })
      let menu = this.story.map(item => item.title)

      this.setData({
        menu: menu
      })
      console.log(menu)


      let newstory = wx.getStorageSync('newstory')
      console.log("新剧情", newstory)
      if (newstory.length == 0) {
        console.log("新剧情查看完毕")
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
      let news = this.data.news

      for (let i = 0; i < this.story.length; i++) {
        if (newstory.includes(this.story[i]._id)) {
          news[i] = true;
        }
      }


      var progress = []
      for (let i = 0; i < menu.length; i++) {
        progress[i] = wx.getStorageSync(this.story[i]._id + 'progress')
      }
      this.setData({
        news: news,
        progress: progress
      })
    }else{
      this.setData({
        login:false
      })
    }
   
      
  },
  onHide: function () {
    wx.hideLoading()
  },

  handleitem(e){
    
    var { index } = e.currentTarget.dataset
    let news=this.data.news
    news[index]=false
    this.setData({
      news:news
    })
    let group = this.story[index]._id
    console.log("点击馆藏", group)
    let newstory = wx.getStorageSync('newstory')
    console.log("原有新剧情", newstory)
    let a = newstory.indexOf(group)
    if(a>=0){
    newstory.splice(a, 1)
    }
    console.log("剧情所在位置", a, "现有新剧情", newstory)
    wx.setStorageSync('newstory', newstory)
    var name1=this.story[index].member[0]
    var name2 = this.story[index].member[1]

   
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    })
    wx.navigateTo({
      url: '/pages/onestory/index?name1='+name1+'&name2='+name2,
    })
  },
    
})