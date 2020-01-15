// pages/change/index.js
const changessr=40 
const changesr=20
const changer=1
const db = wx.cloud.database()
const _ = db.command
Page({

  
  data: {
    rank:[0,0,0],
    ticket:0,
    card:[],
    loading:[],
    chosen:[],
    amount:0
  },

  onLoad: function (options) {
    let card=wx.getStorageSync('mycard')
    card.sort(function (a, b) { return b['rank'].length - a['rank'].length} )
    let loading=[]
    let chosen=[]
    for(let i=0;i<card.length;i++){
      loading[i]=1,
      chosen[i]=0
    }
    this.setData({
      card:card,
      loading:loading,
      chosen:chosen
    })
  },
  load(e) {
    const { index } = e.currentTarget.dataset
    let loading = this.data.loading
    loading[index] = 0
    this.setData({
      loading: loading
    })
  },
  plus(e){
    
    const { index } = e.currentTarget.dataset
    
    let card=this.data.card
    let chosen=this.data.chosen
    let rank=this.data.rank
    let amount=this.data.amount
    let ticket
    if(chosen[index]==card[index].num){
    }else{
      chosen[index]=chosen[index]+1
      if(card[index].rank=="ssr"){
        rank[0]=rank[0]+1
        amount = amount + changessr
      } else if (card[index].rank == "sr"){
        rank[1]=rank[1]+1
        amount = amount + changesr
      } else  {
        rank[2] = rank[2] + 1
        amount = amount + changer
      }
      ticket=Math.floor(amount/10)
      this.setData({
        chosen:chosen,
        rank:rank,
        ticket:ticket,
        amount:amount
      })
    }
  },
  minus(e){
  const { index } = e.currentTarget.dataset
  let card = this.data.card
  let chosen = this.data.chosen
  let rank = this.data.rank
  let amount = this.data.amount
  let ticket
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
    ticket = Math.floor(amount / 10)
    this.setData({
      chosen: chosen,
      rank: rank,
      ticket: ticket,
      amount: amount
    })
  }
  },
  sure(){
    if(this.data.amount==0){
      wx.showModal({
        content: '请选择用于兑换的卡牌',
        showCancel: false
      })
    }else if(this.data.amount%10!=0){
      wx.showModal({
        content: '每10张R卡兑换一张抽卡券，选择R卡张数需为10的倍数，请再次选择',
        showCancel:false
      })
    }else{
      var choseall=false
      for(let i=0;i<this.data.card.length;i++){
        if(this.data.chosen[i]!=0){
          if(this.data.chosen[i]==this.data.card[i].num){
              choseall=true
              break
          }
        }
      }
      if(choseall){
        wx.showModal({
          content: '您选择将某张卡牌全部兑换，未留下余卡。因此兑换后此卡牌将从您的馆藏中删除，确认兑换？',
          success: (res) => {
            if (res.confirm) {
              try{
              this.update()
              }catch(err){
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
      }else{
      wx.showModal({
        content: '兑换后将无法更改，确认兑换？',
        success:(res)=> {
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
           
          }}
      })
      }
    }
    
  },
  update(){
    var card = this.data.card
    var chosen = this.data.chosen
    var chosencard=[]
    var ticket = this.data.ticket
    var _id=wx.getStorageSync('_id')
    var ticketavant = wx.getStorageSync('ticket')
    console.log("之前拥有的卡",card)
    for (let i = card.length-1;i>=0;i--){
      let num=chosen[i]
      if(num>0){
        if(num==card[i].num){
          console.log("删除卡牌","张数",num,"信息",card[i])
          card.splice(i,1)
          chosencard.push(card[i])
        }else {
          console.log("卡牌数减少", "张数", num, "信息", card[i])
        
          card[i].num = card[i].num-num
          
          let len=chosencard.push(card[i])
          chosencard[len-1].costnum=num
          
        }
      }
    }
   wx.showLoading({
     title: '兑换中',
     mask:true
   })
    var d = new Date()
    var time = d.toLocaleDateString() + d.toLocaleTimeString();
    db.collection('change').add({
      data: {
        userid: _id,
        changeidcard: chosencard,
        time: time,
        type: "抽卡券"
      }
    })
    db.collection('user').doc(_id).update({
      data:{
        card:card,
        ticket:_.inc(ticket)
      },
      }).then(res=>{
        
      let newchosen = []
      for (let i = 0; i < card.length; i++) {
        
        newchosen[i] = 0
      }
      console.log("兑换之后的卡",card)
      wx.setStorageSync('mycard', card)
      wx.setStorageSync('ticket', ticket + ticketavant)
      console.log("向数据库更新卡牌信息",res)
      this.setData({
        amount: 0,
        card: card,
        ticket: 0,
        rank: [0, 0, 0],
        chosen: newchosen
      })
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
      }).catch(err => {
        console.log(err)
       
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
    
  },
  checkboxChange: function (e) {
    if(e.detail.value.length==1){
      let card = this.data.card
      let chosen = []
      let rank=this.data.rank
      let amount=this.data.amount
      let ticket=this.data.ticket
      for (let i = 0; i < card.length; i++) {
        chosen[i] = card[i].num-1
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
        ticket = Math.floor(amount / 10)
      }
      this.setData({
        chosen: chosen,
        rank: rank,
        ticket: ticket,
        amount: amount
      })
    }else{
      let chosen=[]
      let card=this.data.card
      for (let i = 0; i < card.length; i++) {
          chosen[i] = 0
      }
      this.setData({
        chosen:chosen,
        rank:[0,0,0],
        ticket:0,
        amount:0
      })
    }
  }

})