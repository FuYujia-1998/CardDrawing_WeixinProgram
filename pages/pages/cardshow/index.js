// pages/cardshow/index.js
const db = wx.cloud.database()
const _ = db.command
const baodi=100
const xiandingpro=0.8
var app=getApp()
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
    onecardnew:false,
    tencardnew: [false, false, false, false, false,false, false, false, false, false],
    showonce:false
  },
 
  card_ssr: [],
  card_sr: [],
  card_r: [],
  spcard_ssr:[],
  spcard_sr: [],
  spcard_r: [],
  group:'',
  name2:'',
  

  
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
    
    if(type==1){ //馆藏限定卡池
    
      const {name1}=options
      const {name2}=options
      
      console.log("馆藏限定成员", name1, name2)

      this.spcard_r = this.filter(r, name1, name2)
      this.spcard_sr = this.filter(sr, name1, name2)
      this.spcard_ssr = this.filter(ssr, name1, name2)
      this.group=name1
      this.name2=name2
      console.log("限定成员卡牌",this.spcard_r, this.spcard_sr, this.spcard_ssr)
    }

    //抽卡
    try{
      this.getcard(num, type, free)
    }catch(err){
      console.log("1",err)
      wx.showModal({
        content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack()
          } 
        }
      })
    }
    

    //设置动画
    setTimeout(function () {
      this.animation()
    }.bind(this), 700)
    
    console.log(this.data.animationData)
  },
 
onShow(){
console.log("onshow")
},

  onShareAppMessage: function () {
    return {
      title: '我在 <HMH48抽抽抽> 中抽到了这些卡牌',//分享内容
      path: '/pages/index/index',//分享地址

    }
  },
  onUnload(){
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('hasnotfinish', { data: !this.data.finish })
  },
 
  filter(card_all, name1, name2){
    function check(ele) {
      return (ele.charactor == name1 || ele.charactor == name2);
    }
    return card_all.filter(check)
 },
  animation:function() {
    console.log("here")
    var animationdata = []
    for (let i = 0; i < 10; i++) {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      
      animation.opacity(0.2).scale(0.3,0.3).step({ delay: 300 * i })
      animation.opacity(0.8).scale(1.4, 1.4).step()
      animation.opacity(1).scale(1.4,1.4).step()
      animation.opacity(1).scale(1,1).step()
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
      console.log("抽一张",myrandcard)
      this.updateonecard(myrandcard,free,type) //将抽到的卡加入用户卡库，加入缓存
      let mysrc = '/icons/card_' + myrandcard.rank+'.png' //根据等级设置卡的背面
      this.setData({
        randcard: myrandcard,
        onecard:true,
        src:mysrc
      })
    } else {
      myrandcard=this.randcardten(type)
      console.log("抽十张",myrandcard)
      this.updateten(myrandcard)
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
    if(type==1){
    let times=wx.getStorageSync('times')
    console.log("此馆藏之前已抽几次：",times[this.group])
    let progress=wx.getStorageSync(this.group+'progress')
    console.log("此馆藏进度：", progress)
    if(times[this.group]>=baodi && progress<100){
        var cardlist=this.spcard_r.concat(this.spcard_sr,this.spcard_ssr)
        let mycard=wx.getStorageSync('mycard')
        var card_notget = []
        var obj = {};
        for (let i = 0; i < mycard.length; i++) {
          obj[mycard[i]._id] = true;
        }
        for (let i = 0; i < cardlist.length; i++) {
          if (!obj[cardlist[i]._id]) {
            card_notget.push(cardlist[i])
          } 
        }
      console.log("激发保底", card_notget)
        var rc=card_notget.pop()
         console.log("保底卡牌",rc)
        return rc
    }else{
    let cardset=this.randrank(type)
    let card=cardset.card //确定所抽卡等级
    let rc = this.randcard(card)  //在此等级卡牌里抽卡
    return rc}
    }else{
      let cardset = this.randrank(type)
      let card = cardset.card //确定所抽卡等级
      let rc = this.randcard(card)  //在此等级卡牌里抽卡
      return rc
    }
  },

  has(tencard,card){
     for(let i=0;i<tencard.length;i++){
       if(tencard[i]._id==card._id)return true
     }
     return false
  },

  

  randcardten(type){
    
      let times = wx.getStorageSync('times')
    console.log("此馆藏之前已抽几次：", times[this.group])
      let progress = wx.getStorageSync(this.group + 'progress')
    console.log("此馆藏进度：",progress)
      if (type==1&&times[this.group] >= baodi && progress < 100) {
        
        var cardlist = this.spcard_r.concat(this.spcard_sr, this.spcard_ssr)
        let mycard = wx.getStorageSync('mycard')
        var card_notget = []
        var obj = {};
        for (let i = 0; i < mycard.length; i++) {
          obj[mycard[i]._id] = true;
        }
        for (let i = 0; i < cardlist.length; i++) {
          if (!obj[cardlist[i]._id]) {
            card_notget.push(cardlist[i])
          }
        }
        console.log("激发限定卡池保底",card_notget)
        var tencard = []
        let k=0
        while (card_notget.length>0&&tencard.length<10){
          tencard[k] = card_notget.pop()
          k=k+1
        }
         while(tencard.length<10){
           rr = this.randrank(type)
           ca = this.randcard(rr.card)
           tencard.unshift(ca)
         }
        return tencard
      } else {
    var tencard=[]
    var rr
    var has=false
    var ca
    if(type==0){ //常规卡池
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
      console.log("触发十连保底", tencard,"保底卡牌",ca)
      tencard.unshift(ca)
    }
      return tencard
    }else if(type==1){ //馆藏限定卡池
      for (let i = 0; i < 10; i++) {
        rr = this.randrank(type)
        ca = this.randcard(rr.card)
        tencard.unshift(ca)
      }
      return tencard
    }
     }

  },

  randrank(type){
    
    let l=Math.random()
    
    if (type == 0){ //常规卡池
      
      if (l < app.globalData.prossr){
      console.log("cardrank", l,"ssr")
      return {
        card:this.card_ssr,
        has:true
      }
      } else if (l < app.globalData.prosr){
      console.log("cardrank", l, "sr")
      return {
        card: this.card_sr,
        has: true
      }
    } else {
      console.log("cardrank", l, "r")
      return {
      card: this.card_r,
        has: false
    }}
    }else if(type==1){ //限定卡池
     
      let g = Math.random()
      console.log("限定卡池抽等级",g)
      if(g<xiandingpro){
        console.log("g<0.8,抽到限定卡池卡牌")
        if (l < app.globalData.prossr) {
       
        return {
          card: this.spcard_ssr,
          has: true
        }
        } else if (l < app.globalData.prosr) {
      
        return {
          card: this.spcard_sr,
          has: true
        }
      } else {
    
        return {
        
        card: this.spcard_r,
        has: false
      }}
    }else{
        console.log("g>0.8，抽到常规卡牌")
        if (l < app.globalData.prossr) {
       
        return {
          card: this.card_ssr,
          has: true
        }
        } else if (l < app.globalData.prosr) {
       
        return {
          card: this.card_sr,
          has: true
        }
      } else {

        return {
        card: this.card_r,
        has: false
      }}
    }}else if(type==2){ //ssr卡池
      
      if(l<0.3){
        return {
          card:this.card_ssr,
          has:true
        }
      }else{
        return {
          card:this.card_sr,
          has:true
        }
      }
    }
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



  updateten(card){
    let mycard=wx.getStorageSync('mycard')
    let progress=wx.getStorageSync('progress')
    let _id = wx.getStorageSync('_id')
    
      wx.cloud.callFunction({
        name: "updatecardten",
        data: {
          card: card,
          _id: _id,
          group: this.group,
          progress: progress,
          mycard: mycard
        },
       
      }).then(res => {
        console.log("更新结果", res)
        let mypresentmoney = res.result.presentmoney
        let mycard = res.result.card
        let progress = res.result.progress
        let newstory = res.result.newstory
        let tencardnew = res.result.tencardnew
        let times = res.result.times
        this.setData({
          tencardnew: tencardnew
        })
        wx.setStorageSync('mycard', mycard)
        wx.setStorageSync('presentmoney', mypresentmoney)
        wx.setStorageSync('times', times)
        console.log("此馆藏已抽几次：", times[this.group])
        console.log("此馆藏进度：", progress[this.group])
        if (newstory.length != 0) {
          console.log("解锁新剧情", newstory)
          wx.setStorageSync("news", true)
          let storyavant = wx.getStorageSync("newstory")
          storyavant = storyavant.concat(newstory)
          storyavant = Array.from(new Set(storyavant))
          wx.setStorageSync("newstory", storyavant)
        }
        this.setData({
          finish: true
        })
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
        }).catch(err => {
          wx.hideLoading()
          console.log("2", err)
          wx.showModal({
            content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
            showCancel: false,
            success(res) {

              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        })
    
    

  },

  updateonecard(newcard,free,type) {
    var d = new Date()
    var time = d.toLocaleDateString() + d.toLocaleTimeString();
    let _id = wx.getStorageSync('_id')
    if(free==1){
      db.collection('updatecard').add({
        data: {
          userid: _id,
          updatecard: newcard,
          time: time,
          free:true
        }
      })
    }else{
      db.collection('updatecard').add({
        data: {
          userid: _id,
          updatecard: newcard,
          time: time
        }
      })
    }
    if(type==2){ //SSR卡池
      var progress
      if (newcard.rank == "ssr") { progress = 16 }
      else if (newcard.rank == "sr") { progress = 8 }
      else { progress = 2 }
      var title = newcard.group
      let id = wx.getStorageSync('_id')
      let mycard=wx.getStorageSync('mycard')
      let cardid=mycard.map(element=>element._id)
      if (!cardid.includes(newcard._id)){
        this.setData({
          onecardnew: true
        })
        db.collection('user').doc(id).update({
          data: {
            card: _.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank }),
            ticket: _.inc(-5),
            progress: {
              [title]: _.inc(progress)
            }
          },
         
        }).then(res => {
          console.log("得到新卡")
          mycard.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank })
          let ticket=wx.getStorageSync('ticket')
          let avant=wx.getStorageSync(title+'progress')
          let now=avant+progress
          this.check(avant,now,newcard)
          wx.setStorageSync('mycard', mycard)
          wx.setStorageSync('ticket', ticket-5)
            this.setData({
              finish: true
            })
            console.log("添加新卡",res)
          }).catch(err => {
            console.log("3", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })
      }else{
        let card = mycard
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
            ticket: _.inc(-5),
          },
          
        }).then(res => {
          console.log("得到旧卡")
          mycard[k].num = mycard[k].num+1
          let ticket = wx.getStorageSync('ticket')
          this.setData({
            finish: true
          })
          wx.setStorageSync('mycard', mycard)
          wx.setStorageSync('ticket', ticket-5)
          console.log("添加旧卡", res)

          }).catch(err => {
            console.log("4", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })
      }

    }else if (type==0){ //常规卡池
      var cost = -app.globalData.onecost
    if(free==1){cost=0}
    var progress
    if (newcard.rank == "ssr") { progress = 16 }
    else if (newcard.rank == "sr") { progress = 8 }
    else { progress = 2 }
    var title = newcard.group
    let id = wx.getStorageSync('_id')
      let mycard = wx.getStorageSync('mycard')
      let cardid = mycard.map(element => element._id)
      if (!cardid.includes(newcard._id)){
        this.setData({
          onecardnew: true
        })
        db.collection('user').doc(id).update({
          data: {
            card: _.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank }),
            presentmoney: _.inc(cost),
            progress: {
              [title]: _.inc(progress)
            }
          },
        }).then(res => {
          console.log("得到新卡")
          mycard.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank })
          let presentmoney = wx.getStorageSync('presentmoney')
          console.log(presentmoney)
          let avant = wx.getStorageSync(title + 'progress')
          let now = avant + progress
          this.check(avant, now, newcard)
          wx.setStorageSync('mycard', mycard)
          wx.setStorageSync('presentmoney', presentmoney +cost)
          this.setData({
            finish: true
          })

            console.log("添加新卡", res)
          }).catch(err => {
            console.log("5", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })
        
      } else {
        let card = mycard
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
          },
        }).then(res => {
          console.log("得到旧卡", res)
          mycard[k].num = mycard[k].num + 1
          let presentmoney = wx.getStorageSync('presentmoney')
          this.setData({
            finish: true
          })
          wx.setStorageSync('mycard', mycard)
          wx.setStorageSync('presentmoney', presentmoney + cost)
            console.log("添加旧卡")
          }).catch(err => {
            console.log("6", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })

        
      }
    } else if (type == 1) { //馆藏限定卡池
      let group=this.group
      var cost = -app.globalData.onecost
      if (free == 1) { cost = 0 }
      var progress
      if (newcard.rank == "ssr") { progress = 16 }
      else if (newcard.rank == "sr") { progress = 8 }
      else { progress = 2 }
      var title = newcard.group
      let id = wx.getStorageSync('_id')
      let mycard = wx.getStorageSync('mycard')
      let cardid = mycard.map(element => element._id)
      if (!cardid.includes(newcard._id)) {
        this.setData({
          onecardnew: true
        })
        db.collection('user').doc(id).update({
          data: {
            card: _.push({ '_id': newcard._id, 'num': 1, 'src': newcard.src, 'charactor': newcard.charactor, 'rank': newcard.rank }),
            presentmoney: _.inc(cost),
            progress: {
              [title]: _.inc(progress)
            },
            times: {
              [group]: _.inc(1)
            }
          },
        }).then(res => {
          console.log("得到新卡", res)
          db.collection('user').doc(id).field({
            presentmoney: true,
            card: true,
            progress: true,
            times: true
          }).get().then(res => {
            let newdata = res.data
            let avant = wx.getStorageSync(newcard.group + 'progress')
            this.check(avant, newdata.progress[newcard.group],newcard)
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
            wx.setStorageSync('times', newdata.times)
            this.setData({
              finish: true
            })
            console.log("此馆藏已抽几次：", newdata.times[this.group])
            console.log("添加新卡",res)
          })
          }).catch(err => {
            console.log("7", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })
      } else {
        let card = mycard
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
            times: {
              [group]: _.inc(1)
            }
          },
        }).then(res => {
          console.log("得到旧卡", res)
          db.collection('user').doc(id).field({
            presentmoney: true,
            card: true,
            times: true
          }).get().then(res => {
            let newdata = res.data

            this.setData({
              finish: true
            })
            wx.setStorageSync('mycard', newdata.card)
            wx.setStorageSync('presentmoney', newdata.presentmoney)
            wx.setStorageSync('times', newdata.times)
            console.log("此馆藏已抽几次：", newdata.times[this.group])
            console.log("添加旧卡", res)
          })

          }).catch(err => {
            console.log("8", err)
            wx.hideLoading()
            wx.showModal({
              content: '玩家们太热情了TTTT！由于服务器压力，今日全服抽卡总数已达上限，请明日再来~',
              showCancel: false,
              success(res) {

                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          })
      }
    }

  },

  check(avant,now,newcard){

    // let avant = wx.getStorageSync(newcard.group + 'progress')
    // let now = newdata_progress[newcard.group]
    var has = false
    if (avant < 25 && now >= 25) { has = true }
    if (avant < 50 && now >= 50) { has = true }
    if (avant < 75 && now >= 75) { has = true }
    if (avant < 100 && now == 100) { has = true }
    if (has) {
      wx.setStorageSync("news", true)
      let storyavant = wx.getStorageSync("newstory")
      console.log("新剧情", newcard.group)
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
    console.log("load")
  },

  preview(){
    
    wx.previewImage({
      current: this.data.currentsrc, // 当前显示图片的http链接
      urls: [this.data.currentsrc]
    })
  },
  showonce(){
    if(!this.data.showonce){
    wx.showLoading({
      title: '',

    })
    let l=this.data.randcard.length
    console.log("一键翻牌",this.data.randcard)
    
    if(l>1){
      let src = []
    for(let i=0;i<l;i++){
      
       src[i]=this.data.randcard[i].src
      
    }
      this.setData({
        src: src,
        showonce:true
      })
    }
    else{
      let src = this.data.randcard.src
      this.setData({
        src: src,
        showonce:true
      })
    }
    }
    
    
  },
  load(){

    wx.hideLoading()
  },
  

})