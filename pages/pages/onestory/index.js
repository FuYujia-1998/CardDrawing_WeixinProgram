// pages/onestory/index.js
const db = wx.cloud.database()
Page({

  
  data: {
    card_get:[],
    card_notget:[],
    story:[],
    rank:{},
    finish:[false,false,false,false],
    percent:'',
    showModal:false,
    loading1:[],
    loading2:[],
    loading3:[1,1,1,1],
  },
  group:'',
  member:[],
  onLoad: function (options) {
     
      var name1=options.name1
      var name2=options.name2
      console.log("此馆成员",name1, name2)
      this.group=name1
      this.member[0]=name1
      this.member[1]=name2
      var mycard = wx.getStorageSync('mycard')
      var card_all=wx.getStorageSync('card_all')
      var cardlist=this.getcardlist(card_all,name1,name2)

      var getornot=this.getornot(cardlist,mycard)
      var card_get = getornot.card_get
      var card_notget = getornot.card_notget
      let loading1 = []
      for (let i = 0; i < card_get.length; i++) {
        loading1[i] = 1
      }
      let loading2 = []
      for (let i = 0; i < card_notget.length; i++) {
        loading2[i] = 1
      }
      

      var story=wx.getStorageSync(name1+'story')
     
      var cardlistnum = this.getranknumber(cardlist)
      var getcardnum = this.getranknumber(card_get)
      
      var progress=wx.getStorageSync(name1+'progress')
      var finish=[]
      if(progress<25){finish=[false,false,false,false]}
      else if(progress<50){finish=[true,false,false,false]}
      else if (progress < 75) { finish = [true, true, false, false] }
      else if (progress < 100) { finish = [true, true, true, false] }
      else { finish = [true, true, true, true] }
      let rank={
        totalssr: cardlistnum.ssr,
        totalsr: cardlistnum.sr,
        totalr: cardlistnum.r,
        myssr: getcardnum.ssr,
        mysr: getcardnum.sr,
        myr: getcardnum.r,
      }
      this.setData({
        card_notget:card_notget,
        card_get:card_get,
        percent:progress,
        story:story,
        rank:rank,
        finish:finish,
        loading1:loading1,
        loading2:loading2
      })
    wx.setNavigationBarTitle({
      title: name1 + (name2 ? " & " : "") + name2 +"馆",
    })
    

      
     
  },

  getornot(cardlist, mycard){
    var card_get=[]
    var card_notget=[]
    var obj = {};
    for (let i = 0; i < mycard.length; i++) {
        obj[mycard[i]._id] = true;
    }
    for(let i=0;i<cardlist.length;i++){
      if (!obj[cardlist[i]._id]){
        card_notget.push(cardlist[i])
      }else{
        card_get.push(cardlist[i])
      }
    }

    return {
      card_get:card_get,
      card_notget:card_notget
    }
  },

  getcardlist(card_all, name1, name2){
   
    function check(ele) {
      return (ele.charactor == name1 || ele.charactor == name2);
    }
    return card_all.filter(check)
  },
  
  getranknumber(cardlist){
  
    var ssr =0
    var sr =0
    var r =0
    for(let i=0;i<cardlist.length;i++){

      if (cardlist[i].rank == "ssr") { 
        
        ssr=ssr+1}
      else if (cardlist[i].rank == "sr") { sr = sr + 1 }
      else{ r = r + 1 }
    }
    return {
      r:r,
      sr:sr,
      ssr:ssr
    }
  },

  question(){
    wx.showModal({
      title: '规则说明',
      content: '1.本馆需收集' + this.member[0] + (this.member[1] ? " 和 " : "") + this.member[1] +'卡牌，点击页面下方按钮查看本馆需收集的所有卡牌。\n\n 2.收集进度达到相应百分比，可解锁相应剧情。收集一张本馆SSR，集卡进度增加16%，收集一张SR进度增加8%，收集一张R进度增加2%。\n\n 3.可在本馆限定几率提升日，前往馆藏限定卡池抽卡，本馆卡牌抽中几率将达到80%，并设有保底。限定馆藏每日轮换。',
      showCancel:false,
    })
  },
  preventTouchMove: function () {
  },

  show(e) {
    this.setData({
      showModal:true,
      
    })
    
    
  },


  go: function () {
    this.setData({
      showModal: false,
    
    })
  },
  load1(e) {
    console.log("here")
    const { index } = e.currentTarget.dataset
    let loading1 = this.data.loading1
    loading1[index] = 0
    this.setData({
      loading1: loading1
    })
  },
  load2(e) {
    const { index } = e.currentTarget.dataset
    let loading2 = this.data.loading2
    loading2[index] = 0
    this.setData({
      loading2: loading2
    })
  },
  load3(e) {
    const { index } = e.currentTarget.dataset
    let loading3 = this.data.loading3
    loading3[index] = 0
    this.setData({
      loading3: loading3
    })
  },
  preview(e){
    const { src } = e.currentTarget.dataset
    wx.previewImage({
      urls: [src],
    })
  },
  notget(){
    wx.showModal({
      
      content: '还未获得卡牌，无法查看大图',
      showCancel: false,
      
    })
  },
  startstory(e){
    
    const {index}=e.currentTarget.dataset
   console.log("查看第段剧情",index)
   wx.navigateTo({
     url: '/pages/startstory/index?index='+index+'&group='+this.group,
   })
  },
  prevent(){
  }

  
})