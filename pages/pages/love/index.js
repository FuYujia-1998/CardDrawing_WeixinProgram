// pages/love/index.js
Page({

  
  data: {
    src:'',
    progress:'',
    title:'',
    name:'',
    text:'',
    diary:'',
    call:"",
    cardlist:'',
    loading:'',
    currentindex:0,
    showmodal:false,
    modalcall:false,
    modalbg:false,
    modalhudong:false,
    modaldiary:false,
    hudong:''
  },
  call:'',
  love:'',
  lovecontext:'',
  src:'',
  hudongcontext:'',
  onLoad: function (options) {
    var name = options.name
    var lovecontext = wx.getStorageSync('lovecontext')
    if(!lovecontext){
      wx.showModal({
        content: '请先前往“我的”页面登录',
        showCancel:false
      })
    }else{
    var datacontext = lovecontext[name]
    var hudong = datacontext.text
    function norandom(ele) {
      return ele.hudong != "random"
    }
    hudong = hudong.filter(norandom)
    console.log(hudong)
    this.setData({
      name:name,
      hudong:hudong
    })
    }
  },

  onShow(){
    var mycard = wx.getStorageSync('mycard')
    var lovecontext = wx.getStorageSync('lovecontext')
    
    var love = wx.getStorageSync('love')
    var diary=love[this.data.name].diary
    var cardlist = this.getcardlist(mycard, this.data.name)
    var loading = []
    for (let i = 0; i < cardlist.length; i++) {
      loading[i] = 1
    }
    
    this.love = love
    this.lovecontext = lovecontext
    var data = love[this.data.name]
    var datacontext = lovecontext[this.data.name]
   
    this.setData({
      progress: data.progress,
      title: data.title,
      call: datacontext.call,
      cardlist: cardlist,
      loading: loading,
      diary:diary,
      lovecontext:lovecontext
    })
    console.log(diary[0])
    if(diary&&diary.length>0){
      this.setData({
        text: diary[0].sentence
      })
    }else{
      this.setData({
        text: "你好"
      })
    }
    var src = datacontext.src
    if(!src){
      if (cardlist[0]){
        console.log("cardlist", cardlist)
        src = cardlist[0].src
      }
      
      if (!src){
        wx.showModal({
          showCancel:false,
          content: '还未获得'+this.data.name+'卡牌,背景暂时为空',
        })
      }else{
        this.setData({
          src: src
        })
        lovecontext[this.data.name].src=src
        wx.setStorageSync('lovecontext', lovecontext)
      }
    }else{
      this.setData({
        src:src
      })
    }
    if (datacontext.call=='未设置'){
     this.setData({
       showmodal:true,
       modalcall:true
     })
    }
  },
  getcardlist(mycard, name) {

    function check(ele) {
      return (ele.charactor == name);
    }
    return mycard.filter(check)
  },
  preventTouchMove(){
  },
  inputcall(event){
    this.call = event.detail.value
  },
  
  call() {
    if (!this.data.lovecontext) {
      wx.showModal({
        content: '请先前往“我的”页面登录',
        showCancel: false
      })
    } else {
 this.setData({
   showmodal:true,
   modalcall:true
 })}
  },
  gocall(){
    this.setData({
      call:this.call,
      showmodal:false,
      modalcall:false
    })
   this.lovecontext[this.data.name].call=this.call
    wx.setStorageSync('lovecontext', this.lovecontext)
    console.log(this.lovecontext)
  },
  bg(){
    if (!this.data.lovecontext) {
      wx.showModal({
        content: '请先前往“我的”页面登录',
        showCancel: false
      })
    } else {
    this.setData({
      showmodal: true,
      modalbg: true
    })}
  },
  gobg(){
    this.setData({
      showmodal: false,
      modalbg: false,
      src:this.src
    })
    this.lovecontext[this.data.name].src = this.src
    wx.setStorageSync('lovecontext', this.lovecontext)
  },
  load(e) {
    const { index } = e.currentTarget.dataset
    let loading = this.data.loading
    loading[index] = 0
    this.setData({
      loading: loading
    })
  },
  tapbg(e){
    const { src } = e.currentTarget.dataset
    const { index } = e.currentTarget.dataset
    this.src=src
    this.setData({
      currentindex:index
    })
  },
  hudong(){
    if (!this.data.lovecontext) {
      wx.showModal({
        content: '请先前往“我的”页面登录',
        showCancel: false
      })
    } else {
    this.setData({
      showmodal:true,
      modalhudong:true
    })}
  },
  inputhudong(event) {
    this.hudongcontext = event.detail.value
  },
  taphudong(e){
    const { index } = e.currentTarget.dataset
    let hudong=this.data.hudong[index]
    this.setData({
      modalhudong: false
    })
  wx.navigateTo({
    url: '/pages/lovechange/index?hudong='+hudong.hudong+'&rank='+hudong.rank+'&cost='+hudong.cost+'&name='+this.data.name,
    events: {
      finish: finish => {
        console.log("finish", finish)
        this.setData({
          modaldiary:true
        })

        }
      }
  })
    
  },
 
 gohudong(){
   this.setData({
     modalhudong: false
   })
   let hudongcontext=this.hudongcontext
   console.log(hudongcontext)
   if (!hudongcontext){
     wx.showModal({
       content: '请输入互动内容',
       showCancel: false,
       success:(res)=>{
        if(res.confirm){
          this.setData({
            showmodal:false,
            modalhudong:false
          })
        }
       }
     })
   }else{
     wx.navigateTo({
       url: '/pages/lovechange/index?hudong=' + hudongcontext +'&name='+this.data.name,
       events: {
         finish: finish => {
           console.log("finish", finish)
           this.setData({
             modaldiary: true
           })

         }
       }
     })
     
   }
 },
 cancel(){
   this.setData({
     showmodal: false,
     modalcall: false,
     modalbg: false,
     modalhudong: false,
     modaldiary: false
   })
 },
 diary(){
   if (!this.data.lovecontext) {
     wx.showModal({
       content: '请先前往“我的”页面登录',
       showCancel: false
     })
   } else {
   this.setData({
     showmodal:true,
     modaldiary:true
   })}
 },
 question(){
   wx.showModal({
     content: '1.点击互动，可选择活动，消耗' + this.data.name + '的卡牌，与' + this.data.name + '互动，增加与他的羁绊，羁绊点数无上限。\n\n 2.多试几次，每次' + this.data.name + '会有不同的反应哦。当羁绊达到40，75后，每次互动分别有百分之20的几率触发隐藏剧情。\n\n 3.日记中记录了每一次的互动内容。\n\n 4.点击称呼可修改' + this.data.name + '对你的称呼。\n\n 5.点击背景可选择此板块背景，背景可从已获得的'+this.data.name+'卡牌中选择。',
     showCancel:false
   })
 }
})