// pages/cardshow/index.js
const db = wx.cloud.database()
const _ = db.command
Page({

  data: {
    onecard:false,//判断抽一张或十张
    tencard:false,
    randcard:[],//抽出的卡组
    src:'',//抽出卡组相对应的图像
    animationData: [],//动画
    showModal1:false,//点击卡牌出现卡牌展示
    currentsrc:'',//点击的卡牌图像
  },
  probssr:0.03,
  probsr:0.12,
  probr:0.85,
  card_ssr: [],
  card_sr: [],
  card_r: [],

  
  onLoad: function (options) {
    //读取卡牌数据
    this.card_ssr = wx.getStorageSync('card_ssr')
    this.card_sr = wx.getStorageSync('card_sr')
    this.card_r = wx.getStorageSync('card_r')

    //读取抽卡模式
    const { num } = options

    //抽卡
    this.getcard(num)
    
    //设置动画
    this.animation()
  },
 
  animation:function() {
    
    var animationdata = []
    for (let i = 0; i < 10; i++) {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.opacity(0.2).scale(0.3).step({ delay: 600 * i })
      animation.opacity(0.4).scale(1.0).step()
      animation.opacity(1).rotate(0).scale(1.4).step()
      animation.opacity(1).scale(1).step()
      animationdata[i] = animation.export()
    }
    this.setData({
      animationData: animationdata
    })
    
  },

   getcard(num){
     
    let myrandcard
    if (num == 1) {
      myrandcard = this.randcardone()    
      this.newonecard(myrandcard)
      let mysrc = '/icons/card_' + myrandcard.rank+'.png'
      this.setData({
        randcard: myrandcard,
        onecard:true,
        src:mysrc
      })
    } else {
      myrandcard=this.randcardten()
      this.newupdataten(myrandcard)
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
  


  randcardone(){
    let card=this.randrank().card
    let rc = this.randcard(card)  
    return rc
  },

   has(tencard,card){
     for(let i=0;i<tencard.length;i++){
       if(tencard[i]._id==card._id)return true
     }
     return false
   },

   randcardten(){
    let tencard=[]
    let rr
    let has=false
    while(tencard.length<9){
      rr = this.randrank()    
      let ca = this.randcard(rr.card)
      if(!this.has(tencard,ca)){
        if (rr.has) { has = true }
        tencard.unshift(ca)
      }
    }
    
   
    if(has){
      while (tencard.length < 10) {
        rr = this.randrank()
        let ca = this.randcard(rr.card)
        if (!this.has(tencard, ca)) {
          if (rr.has) { has = true }
          tencard.unshift(ca)
        }
      }
    }else{
      while (tencard.length < 10) {
        
        let ca = this.randcard(this.card_ssr)
        if (!this.has(tencard, ca)) {
          if (rr.has) { has = true }
          tencard.unshift(ca)
        }
      }
    }
    return tencard
  },
  randrank(){
    let l=Math.random()
    if(l<this.probssr){
      return {
        card:this.card_ssr,
        has:true
      }
    }else if(l>1-this.probsr){
      return {
        card: this.card_sr,
        has: false
      }
    } else return {
      card: this.card_r,
        has: false
    }
  },
  searchcard(newcard){
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
  


  newupdataten(card){
    for(let i=0;i<10;i++){
      this.newonecard(card[i])
    }

  },
  
  newonecard(newcard){
    
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
            presentmoney: _.inc(-1)
          }
        }).then(res => {
          console.log("得到新卡")
          db.collection('user').doc(id).get().then(res => {
            let newdata = res.data
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
           let card= wx.getStorageSync('mycard')
           
            console.log("添加新卡",card)
          })
        })
      } else {
        let card = data.card
        let l=card.length
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
            presentmoney: _.inc(-1)
          }
        }).then(res => {
          console.log("得到旧卡")
          db.collection('user').doc(id).get().then(res=>{
            let newdata = res.data
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
            console.log("添加旧卡",newdata)
          })

        })
      }
    })},
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
  }
})