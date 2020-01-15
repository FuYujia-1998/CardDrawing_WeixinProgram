// pages/startstory/index.js
const db = wx.cloud.database()

Page({
  context:[],
  src:[],
  data: {
    member:[],
    type:'',
    text:"",
    src:"",
    currentsrc:0,
    currenttext:0,
    finish:"继续"
  },

  
  onLoad: function (options) {
    
    
    const {index}=options
    const { group } = options
    let storycontext = wx.getStorageSync('storycontext')
    if (!storycontext){
      wx.showLoading({
        title: '加载中',
      })
    console.log("组名",group,"第几段",index)
    wx.cloud.callFunction({
      name:'getonedb',
      data:{
        name:'storycontext'
      }
    }).then(res=>{
      console.log("云端读取剧情",res)
      wx.setStorageSync('storycontext', res.result.data)
      let story=this.select(group,index,res.result.data)
      console.log(story)
      this.context=story.context
      this.src=story.src
      var type
      if(!this.context[0].type){
        type=0
      }else{
        type=this.context[0].type
      }
      this.setData({
        member:story.member,
        type:type,
        text:this.context[0].text,
        src:this.src[0]
      })
      wx.hideLoading()
    })
    }else{
      console.log("本地存储剧情")
      let story = this.select(group, index, storycontext)
      this.context = story.context
      this.src = story.src
      var type
      if (!story.type) {
        type = 0
      } else {
        type =story.type
      }
      this.setData({
        member: story.member,
        type: type,
        text: this.context[0].text,
        src: this.src[0]
      })
     
    }
  },

  select(group,index,storycontext) {
    console.log(storycontext)
    function has(element) {
      return (element.group == group && element.index == index)
    }
    let story = storycontext.filter(has)
    console.log(story)
    return story[0]
  },
  next(){
    if(this.data.finish=="已结束"){
      wx.navigateBack({
        
      })
    }else{
    var currenttext=this.data.currenttext
    if(currenttext==this.context.length-1){
      this.setData({
        finish:"已结束"
      })
    }else{
      let currentcontext = this.context[currenttext + 1]
      
      var type
      if(!currentcontext.type){
        type=0
      }else{
        
        type=currentcontext.type
        console.log("对话", type)
      }
      if(currentcontext.change){
        console.log("换背景")
        var currentsrc = this.data.currentsrc
        this.setData({
          src:this.src[currentsrc+1],
          currentsrc:currentsrc+1,
          text:currentcontext.text,
          currenttext:currenttext+1,
          type:type
        })
      }else{
        this.setData({
          text: currentcontext.text,
          currenttext: currenttext + 1,
          type: type
        })
      }

    }
    }
  },
  onShareAppMessage: function () {
    return {
      title: '我在 <HMH48抽抽抽> 中解锁了剧情',//分享内容
      path: '/pages/index/index',//分享地址

    }
  },
})