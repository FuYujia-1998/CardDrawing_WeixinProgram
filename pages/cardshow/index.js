// pages/cardshow/index.js
const db = wx.cloud.database()
const _ = db.command
Page({

  data: {
    onecard:false, //判断抽一张或十张
    tencard:false,
    randcard:[], //抽出的卡组
    src:'', //抽出卡组相对应的图像（先背面再正面）
    animationData: [], //动画
    showModal1:false, //点击卡牌出现卡牌展示
    currentsrc:'', //点击的卡牌图像
    finish:false,
  },
  probssr:0.03,
  probsr:0.12,
  probr:0.85,
  card_ssr: [],
  card_sr: [],
  card_r: [],
  spcard_ssr:[],
  spcard_sr: [],
  spcard_r: [],

  
  onLoad: function (options) {
    //读取卡牌数据
    
    let ssr= wx.getStorageSync('card_ssr')
    let sr = wx.getStorageSync('card_sr')
    let r = wx.getStorageSync('card_r')
    this.card_ssr =ssr
    this.card_sr =sr
    this.card_r =r

    //读取抽卡模式
    const { num } = options
    const {type}=options
    const {free}=options
    if(type==1){
      const {name1}=options
      const {name2}=options
      this.spcard_r = this.filter(r, name1, name2)
      
      this.spcard_sr = this.filter(sr, name1, name2)
      this.spcard_ssr = this.filter(ssr, name1, name2)
      console.log(this.spcard_r, this.spcard_sr, this.spcard_ssr)
    }

    //抽卡
    this.getcard(num,type,free)

    //设置动画
    this.animation()

    
  },
 
  filter(card_all, name1, name2){
    function check(ele) {
      return (ele.charactor == name1 || ele.charactor == name2);
    }
    return card_all.filter(check)
 },
  animation:function() {

    var animationdata = []
    for (let i = 0; i < 10; i++) {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.opacity(0.2).scale(0.3).step({ delay: 300 * i })
      animation.opacity(0.4).scale(1.0).step()
      animation.opacity(1).rotate(0).scale(1.4).step()
      animation.opacity(1).scale(1).step()
      animationdata[i] = animation.export()
    }
    this.setData({
      animationData: animationdata
    })

  },
  
  getcard(num,type,free){
   
    let myrandcard
    if (num == 1) { //抽一张
      myrandcard = this.randcardone(type) //抽卡    
      this.updateonecard(myrandcard,free) //将抽到的卡加入用户卡库，加入缓存
      let mysrc = '/icons/card_' + myrandcard.rank+'.png' //根据等级设置卡的背面
      this.setData({
        randcard: myrandcard,
        onecard:true,
        src:mysrc
      })
    } else {
      myrandcard=this.randcardten(type)
      console.log("here",myrandcard)
      this.updateten(myrandcard,free)
      let mysrc=[]
      for(let i=0;i<10;i++){
        mysrc[i] = '/icons/card_' + myrandcard[i].rank + '.png'
      }
      this.setData({
        randcard: myrandcard,
        tencard:true,
        src:mysrc
      })
    }
    return myrandcard

  },
  


  randcardone(type){
    
    let cardset=this.randrank(type)
    
    let card=cardset.card //确定所抽卡等级
    let rc = this.randcard(card)  //在此等级卡牌里抽卡
    return rc
  },

  has(tencard,card){
     for(let i=0;i<tencard.length;i++){
       if(tencard[i]._id==card._id)return true
     }
     return false
  },

  

  randcardten(type){
    console.log("type",type)
    var tencard=[]
    var rr
    var has=false
    var ca
    if(type==0){
    for(let i=0;i<9;i++){
      rr = this.randrank(type)
      ca = this.randcard(rr.card)
      if(rr.has) { has = true }
      tencard.unshift(ca)
    }
    if(has){
      rr = this.randrank(type)
      let ca = this.randcard(rr.card)
      tencard.unshift(ca)
    }else{
      ca=this.randcard(this.card_sr)
      tencard.unshift(ca)
    }
      return tencard
    }else if(type==1){
      for (let i = 0; i < 10; i++) {
        rr = this.randrank(type)
        ca = this.randcard(rr.card)
        console.log(ca)
        tencard.unshift(ca)
      }
      return tencard
    }
    

  },

  randrank(type){
    
    let l=Math.random()
    if (type == 0){
    if(l<this.probssr){
      return {
        card:this.card_ssr,
        has:true
      }
    }else if(l>1-this.probsr){
      return {
        card: this.card_sr,
        has: true
      }
    } else return {
      card: this.card_r,
        has: false
    }
    }else if(type==1){
      console.log("here")
      let g = Math.random()
      console.log(g)
      if(g<0.6){
        console.log("<0.6")
      if (l < this.probssr) {
        console.log("ssr", this.spcard_ssr)
        return {
          card: this.spcard_ssr,
          has: true
        }
      } else if (l > 1 - this.probsr) {
        console.log("sr", this.spcard_sr)
        return {
          card: this.spcard_sr,
          has: true
        }
      } else {
        console.log("r", this.spcard_r)
        return {
        
        card: this.spcard_r,
        has: false
      }}
    }else{
      console.log(">0.6")
      if (l < this.probssr) {
        console.log("ssr", this.spcard_ssr)
        return {
          card: this.card_ssr,
          has: true
        }
      } else if (l > 1 - this.probsr) {
        console.log("sr", this.spcard_sr)
        return {
          card: this.card_sr,
          has: true
        }
      } else {
        console.log("r", this.spcard_r)
        return {
        card: this.card_r,
        has: false
      }}
    }}
  },

  
  
  randcard(card){
    let l = card.length
    let i = Math.floor((Math.random() * l))
    card=this.diff(card)
    let newcard = card[i]
    
    return newcard
  },

  diff(arr) {
    for(var i = 0; i<arr.length; i++) {
    var iRand = parseInt(arr.length * Math.random());
    var temp = arr[i];
    arr[i] = arr[iRand];
    arr[iRand] = temp;
    }
    return arr;
  },

  searchcard(newcard) {
    let mycard = wx.getStorageSync('mycard')
    let ml = mycard.length
    let k = -1
    for (let i = 0; i < ml; i++) {
      if (mycard[i]._id == newcard._id) {
        k = i
        break
      }
    }
    return k
  },



  updateten(card,free){
    
    let _id = wx.getStorageSync('_id')
    wx.cloud.callFunction({
      name:"updatecardten",
      data:{
        free:free,
        card:card,
        _id:_id
      }
    }).then(res=>{
      console.log(res)
      let mypresentmoney=res.result.presentmoney
      let mycard=res.result.card
      let progress=res.result.progress
      let newstory = res.result.newstory
      wx.setStorageSync('mycard', mycard)
      wx.setStorageSync('presentmoney', mypresentmoney)
      if(newstory.length!=0){
        wx.setStorageSync("news", true)
        let storyavant = wx.getStorageSync("newstory")
        storyavant = storyavant.concat(newstory)
        console.log(storyavant)
        storyavant = Array.from(new Set(storyavant))
        wx.setStorageSync("newstory", storyavant)
      }
      this.setData({
        finish:true
      })
      wx.setStorageSync('春卷progress', progress.春卷)
      wx.setStorageSync('昊昊progress', progress.昊昊)
      wx.setStorageSync('萱萱progress', progress.萱萱)
      wx.setStorageSync('妙妙progress', progress.妙妙)
      wx.setStorageSync('小佳寺町progress', progress.小佳寺町)
      wx.setStorageSync('小瓜皮progress', progress.小瓜皮)
      wx.setStorageSync('佳佳progress', progress.佳佳)
      wx.setStorageSync('黄姐progress', progress.黄姐)
      wx.setStorageSync('昊哥progress', progress.昊哥)
    })

  },

  updateonecard(newcard,free) {
    console.log(newcard)
    var cost=-2
    if(free==1){cost=0}
    var progress
    if (newcard.rank == "ssr") { progress = 16 }
    else if (newcard.rank == "sr") { progress = 8 }
    else { progress = 2 }
    var title = newcard.group
    let id = wx.getStorageSync('_id')
    db.collection('user').where({
      _id: id,
      'card._id': newcard._id
    }).get().then(res => {
      let data = res.data[0]
      if (!data) {
        
        db.collection('user').doc(id).update({
          data: {
            card: _.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank }),
            presentmoney: _.inc(cost),
            progress: {
              [title]: _.inc(progress)
            }
          }
        }).then(res => {
          console.log("得到新卡")
          db.collection('user').doc(id).get().then(res => {
            let newdata = res.data
            this.check(newcard, newdata)
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
            this.setData({
              finish: true
            })
            console.log("添加新卡")
          })
        })
      } else {
        let card = data.card
        let l = card.length
        let k = -1
        for (let i = 0; i < l; i++) {
          if (card[i]._id == newcard._id) {
            k = i
            break
          }
        }
        let name = 'card.' + k + '.num'
        db.collection('user').doc(id).update({
          data: {
            [name]: _.inc(1),
            presentmoney: _.inc(cost),
            progress: {
              [title]: _.inc(progress)
            }
          }
        }).then(res => {
          console.log("得到旧卡")
          db.collection('user').doc(id).get().then(res => {
            let newdata = res.data
            this.check(newcard,newdata)
            this.setData({
              finish: true
            })
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
            console.log("添加旧卡")
          })

        })
      }
    })
  },

  check(newcard,newdata){

    let avant = wx.getStorageSync(newcard.group + 'progress')
    let now = newdata.progress[newcard.group]
    var has = false
    if (avant < 25 && now >= 25) { has = true }
    if (avant < 50 && now >= 50) { has = true }
    if (avant < 75 && now >= 75) { has = true }
    if (avant < 100 && now == 100) { has = true }
    if (has) {
      wx.setStorageSync("news", true)
      let storyavant = wx.getStorageSync("newstory")
      console.log(storyavant)
      storyavant.push(newcard.group)
      storyavant = Array.from(new Set(storyavant))
      wx.setStorageSync("newstory", storyavant)
    }
    wx.setStorageSync(newcard.group + 'progress', now)
    
    
  },

  show1(){
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      showModal1: true,
      currentsrc:this.data.randcard.src,
      src: this.data.randcard.src,
    })
  },

  preventTouchMove: function () {
  },

  show2(e){
    wx.showLoading({
      title: '',
      mask: true
    })
    const {index}=e.currentTarget.dataset
    let mysrc=this.data.src
    mysrc[index] = this.data.randcard[index].src
    this.setData({
      showModal1: true,
      currentsrc: this.data.randcard[index].src,
      src: mysrc,
    })
  },


  go: function () {
    this.setData({
      showModal1: false,
    })
  },

  load:function(){
    wx.hideLoading()
  },

  preview(){
    console.log("here")
    wx.previewImage({
      current: this.data.currentsrc, // 当前显示图片的http链接
      urls: [this.data.currentsrc]
    })
  },
  showonce(){
    wx.showLoading({
      title: '',

    })
    let l=this.data.randcard.length
    console.log(this.data.randcard)
    
    if(l>1){
      let src = []
    for(let i=0;i<l;i++){
      
       src[i]=this.data.randcard[i].src
      
    }
      this.setData({
        src: src
      })
    }
    else{
      let src = this.data.randcard.src
      this.setData({
        src: src
      })
    }
    
    
  },
  load(){

    wx.hideLoading()
  }

})