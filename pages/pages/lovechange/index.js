// pages/lovechange/index.js
const changessr=100
const changesr=50
const changer=5
const db = wx.cloud.database()
const _ = db.command
Page({

 
  data: {
    rank: [0, 0, 0],
    card:'',
    loading:'',
    chosen: [],
    amount: 0,
    jiban:0,
    hudong:'',
    cost:'',
    costrank:'',
    name:''
  },

 
  onLoad: function (options) {
    var name = options.name
    var hudong=options.hudong
    var rank=options.rank
    var cost=options.cost
    var mycard = wx.getStorageSync('mycard')
    
    var card = this.getcardlist(mycard, name,rank)
    console.log(card)
    var loading = []
    let chosen = []
    for (let i = 0; i < card.length; i++) {
      loading[i] = 1
      chosen[i]=0
    }
    this.setData({
      card:card,
      loading:loading,
      chosen:chosen,
      hudong:hudong,
      cost:cost,
      costrank:rank,
      name:name
    })
    wx.setNavigationBarTitle({
      title: name,
    })
  },

  onUnload() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('finish', { data: {
      finish:true
    }})
  },
  getcardlist(mycard, name,rank) {
    if (!rank||rank=="任意"){
     function check(ele) {
       return (ele.charactor == name);
     }
     return mycard.filter(check)
   }else{
     function check(ele) {
       return (ele.charactor == name && ele.rank == rank);
     }
     return mycard.filter(check)
   }
    
  },
 
  load(e) {
    const { index } = e.currentTarget.dataset
    let loading = this.data.loading
    loading[index] = 0
    this.setData({
      loading: loading
    })
  },
  plus(e) {

    const { index } = e.currentTarget.dataset

    let card = this.data.card
    let chosen = this.data.chosen
    let rank = this.data.rank
    let amount = this.data.amount
    let jiban
    if (chosen[index] == card[index].num) {
    } else {
      chosen[index] = chosen[index] + 1
      if (card[index].rank == "ssr") {
        rank[0] = rank[0] + 1
        amount = amount + changessr
      } else if (card[index].rank == "sr") {
        rank[1] = rank[1] + 1
        amount = amount + changesr
      } else {
        rank[2] = rank[2] + 1
        amount = amount + changer
      }
      jiban = Math.floor(amount / 10)
      this.setData({
        chosen: chosen,
        rank: rank,
        jiban: jiban,
        amount: amount
      })
    }
  },
  minus(e) {
    const { index } = e.currentTarget.dataset
    let card = this.data.card
    let chosen = this.data.chosen
    let rank = this.data.rank
    let amount = this.data.amount
    let jiban
    if (chosen[index] == 0) {
    } else {
      chosen[index] = chosen[index] - 1
      if (card[index].rank == "ssr") {
        rank[0] = rank[0] - 1
        amount = amount - changessr
      } else if (card[index].rank == "sr") {
        rank[1] = rank[1] - 1
        amount = amount - changesr
      } else {
        rank[2] = rank[2] - 1
        amount = amount - changer
      }
      jiban = Math.floor(amount / 10)
      this.setData({
        chosen: chosen,
        rank: rank,
        jiban: jiban,
        amount: amount
      })
    }
  },
  sure() {
    var rankindex
    if(this.data.costrank=='r'){
      rankindex=2
    } else if (this.data.costrank == 'sr'){
      rankindex=1
    } else if (this.data.costrank == 'ssr'){
      rankindex=0
    }else{
      rankindex=-1
    }
    
    if (this.data.amount == 0) {
      wx.showModal({
        content: '请选择用于兑换的卡牌',
        showCancel: false
      })
    } else if (this.data.amount % 10 != 0) {
      wx.showModal({
        content: '每2张R卡提升一点羁绊，选择R卡张数需为2的倍数，请再次选择',
        showCancel: false
      })
    }  else {
      var wrong=false
      if (rankindex > 0) {
        var yushu = this.data.rank[rankindex] / this.data.cost - Math.floor(this.data.rank[rankindex] / this.data.cost)
        if (yushu != 0) {
          wx.showModal({
            content: '每' + this.data.cost + '张' + this.data.costrank + '卡可进行一次' + this.data.hudong + '，选择' + this.data.costrank + '卡张数需为' + this.data.cost + '的倍数，请再次选择',
            showCancel: false
          })
          wrong=true
        }
      }if(!wrong){
      var choseall = false
      for (let i = 0; i < this.data.card.length; i++) {
        if (this.data.chosen[i] != 0) {
          if (this.data.chosen[i] == this.data.card[i].num) {
            choseall = true
            break
          }
        }
      }
      if (choseall) {
        wx.showModal({
          content: '您选择将某张卡牌全部兑换，未留下余卡。因此兑换后此卡牌将从您的馆藏中删除，确认兑换？',
          success: (res) => {
            if (res.confirm) {
              try {
                this.update()
              } catch (err) {
                console.log(err)
                wx.hideLoading()
                wx.showModal({
                  content: '玩家们太热情了TTTT！由于服务器压力，今日兑换次数已达上限，请明日再来~',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              }

            }
          }
        })
      } else {
        
        wx.showModal({
          content: '兑换后将无法更改，确认兑换？',
          success: (res) => {
            if (res.confirm) {
              try {
                this.update()
              } catch (err) {
                console.log(err)
                wx.hideLoading()
                wx.showModal({
                  content: '玩家们太热情了TTTT！由于服务器压力，今日兑换次数已达上限，请明日再来~',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              }

            }
          }
        })
      }
      }
    }
    

  },
   getnotcardlist(mycard, name, rank) {
    if (!rank||rank=="任意") {
      function check(ele) {
        return (ele.charactor != name);
      }
      return mycard.filter(check)
    } else {
      function check(ele) {
        return (ele.charactor != name || ele.rank != rank);
      }
      return mycard.filter(check)
    }

  },
  update() {
    var card = this.data.card
    var chosen = this.data.chosen
    var jiban = this.data.jiban
    var chosencard = []
    var _id = wx.getStorageSync('_id')
    var love = wx.getStorageSync('love')
    var mycard = wx.getStorageSync('mycard')
    var lovecontext = wx.getStorageSync('lovecontext')
    var jibanavant = love[this.data.name].progress
    var jibannow = jibanavant + jiban
    var title
    if (jibannow < 25) {
      title = "路人"
    } else if (jibannow < 50) {
      title = "普通粉丝"
    } else if (jibannow < 75) {
      title = "忠实粉丝"
    } else {
      title = lovecontext[this.data.name].title
    }
   
    var cardlast= this.getnotcardlist(mycard,this.data.name,this.data.costrank)
   
    
    console.log("之前拥有的卡", card)
    for (let i = card.length - 1; i >= 0; i--) {
      let num = chosen[i]
      if (num > 0) {
        if (num == card[i].num) {
          console.log("删除卡牌", "张数", num, "信息", card[i])
          card.splice(i, 1)
          chosencard.push(card[i])
        } else {
          console.log("卡牌数减少", "张数", num, "信息", card[i])
          card[i].num = card[i].num - num
          let l = chosencard.push(card[i])
          chosencard[l - 1].costnum = num
        }
      }
    }
    var name=this.data.name
    var totalcard = card.concat(cardlast)
    var diary = love[this.data.name].diary
    var text = lovecontext[this.data.name].text
    console.log(diary)
    console.log(text)
    var hudong = this.data.hudong

    function find(ele) {
      return ele.hudong == hudong;
    }
    function findrandom(ele) {
      return ele.hudong == "random";
    }
    if(!this.data.costrank){
      var index = text.findIndex(findrandom)
    }else{
      var index = text.findIndex(find)
    }
    
    
    var d = new Date()
    var date = d.toLocaleDateString()
    var time = d.toLocaleTimeString();
    var hudong
    var answerset
    var story
    let r = Math.random()
    
    if(!this.data.costrank){
      story = this.data.hudong
      answerset = text[index].answerset
    }else{
      story = text[index].story
      answerset = text[index].answerset
    }
      
    
    let l = answerset.length
    let i = Math.floor((r * l))
    var hidden
    let progress=love[this.data.name].progress
    console.log(lovecontext[this.data.name])
    if(progress>40&&progress<75){
      console.log("1",progress)
      let r2 = Math.random()
      if(r2<0.2){
        
        hidden = lovecontext[this.data.name].hidden[0]
      }
    }else if(progress>75&&progress<130){
      console.log("2", progress)
      let r2 = Math.random()
      if (r2 <0.2) {
        hidden = lovecontext[this.data.name].hidden[1]
      }
    }
    let r2 = Math.random()
    var mydiary = {
      date: date + " " + time,
      story: story,
      context: answerset[i].context,
      sentence: answerset[i].sentence,
      conclusion: this.data.name + "和你增加了" + jiban + "点羁绊"
    }
    if(hidden){
      mydiary.hidden=hidden
    }
    if (answerset[i].no){
      mydiary.no = true
    }
    console.log(mydiary)
    diary.unshift(mydiary)
    wx.showLoading({
      title: '兑换中',
      mask: true
    })

    var d = new Date()
    var time = d.toLocaleDateString() + d.toLocaleTimeString();
    db.collection('change').add({
      data: {
        userid: _id,
        changeidcard: chosencard,
        time: time,
        type: "羁绊"
      }
    })
    db.collection('user').doc(_id).update({
      data: {
        card: totalcard,
        love:{
          [name]:{
            progress:_.inc(jiban),
            title:title,
            diary:diary
          }
        }
      },
      
    }).then(res => {

      
      console.log("兑换之后的卡", totalcard)
      wx.setStorageSync('mycard', totalcard)
      
      love[this.data.name].progress = jibannow
      love[this.data.name].title=title
      wx.setStorageSync('love', love)
      
      love[this.data.name].diary = diary
      wx.setStorageSync('lovecontext', lovecontext)
      console.log("向数据库更新卡牌信息", res)
      
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          content: '玩家们太热情了TTTT！由于服务器压力，今日全服互动总数已达上限，请明日再来~',
          showCancel: false,
          success(res) {

            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      })

  },
  checkboxChange: function (e) {
    if (e.detail.value.length == 1) {
      let card = this.data.card
      let chosen = []
      let rank = this.data.rank
      let amount = this.data.amount
      let jiban = this.data.jiban
      for (let i = 0; i < card.length; i++) {
        chosen[i] = card[i].num - 1
        if (card[i].rank == "ssr") {
          rank[0] = rank[0] + card[i].num - 1
          amount = amount + changessr * (card[i].num - 1)
        } else if (card[i].rank == "sr") {
          rank[1] = rank[1] + card[i].num - 1
          amount = amount + changesr * (card[i].num - 1)
        } else {
          rank[2] = rank[2] + card[i].num - 1
          amount = amount + changer * (card[i].num - 1)
        }
        jiban = Math.floor(amount / 10)
      }
      this.setData({
        chosen: chosen,
        rank: rank,
        jiban: jiban,
        amount: amount
      })
    } else {
      let chosen = []
      let card = this.data.card
      for (let i = 0; i < card.length; i++) {
        chosen[i] = 0
      }
      this.setData({
        chosen: chosen,
        rank: [0, 0, 0],
        jiban: 0,
        amount: 0
      })
    }
  }
  
})