// pages/collection/index.js
Page({

  data: {
    currentindex: 0,
    currentsrc: '',
    currentnum: '',
    card: [],
    scrolltop: 0,
    curentcardnum:'',
    loadsrc: '../../icons/loading.gif',
    menu: ['全部', 'ssr', 'sr', 'r', '春卷', '昊昊', '佳佳', '妙妙', '昊哥', '萱萱', '小佳寺町', '小瓜皮', '豪豪', 'chili', '豪仔', '贾跳舞', '黄sir', '小驼', '黄姐', '贾四艇', '豪哥'],
    loading:[],
   
  },
  card: [],
  cardnum: [],
  onLoad: function(options) {
    
  },
  onLoad(){
    this.card = wx.getStorageSync('mycard')
    var card_all=wx.getStorageSync('card_all')
    var card_ssr = wx.getStorageSync('card_ssr')
    var card_sr = wx.getStorageSync('card_sr')
    var card_r = wx.getStorageSync('card_r')
    this.cardnum[0]=  card_all.length
    this.cardnum[1] = card_ssr.length
    this.cardnum[2] = card_sr.length
    this.cardnum[3] = card_r.length
    let length=wx.getStorageSync('card_length')
    if(!length){
      
      for(let i=4;i<this.data.menu.length;i++){
        this.cardnum[i] = this.setcard(this.data.menu[i],card_all).length
      }
      wx.setStorageSync('card_length', this.cardnum)
      length = this.cardnum
    }
    this.cardnum=length
   console.log("cardnum",this.cardnum)
    let l=this.card.length
    let loading=[]
    for(let i=0;i<l;i++){
      loading[i]=1
    }
    this.setData({
      card: this.card,
      loading: loading,
      curentcardnum:this.cardnum[0]
    })
  },
  onShow() {
  

    this.card= wx.getStorageSync('mycard')

    let newcard
    if (this.data.currentindex == 0) {
      newcard = this.card
    } else {
      newcard = this.setcard(this.data.menu[this.data.currentindex],this.card)
    }
  
    
    console.log("我的卡牌",this.card)
    this.setData({
      card: newcard,
    })
  },

  handleitem(e) {
    const {
      index,
      name
    } = e.currentTarget.dataset
    let newcard
    if (index == 0) {
      newcard = this.card
    } else {
      newcard = this.setcard(name,this.card)
    }
    console.log("更换显示卡牌组", "name",name,"卡组",newcard)
    this.setData({
      currentindex: index,
      card: newcard,
      curentcardnum: this.cardnum[index],
      scrolltop: 0
    })
  },

  setcard(name,card) {
    function has(element) {

      return (element.charactor == name || element.rank == name)
    }
    let newcard = card.filter(has)
    return newcard
  },

  show2(e) {
    const {
      index
    } = e.currentTarget.dataset
    let src = this.data.card[index].src
    let num = this.data.card[index].num
    wx.showLoading({
      title: '',
      mask: true
    })
    wx.navigateTo({
      url: '/pages/onecard/index?src=' + src + '&num=' + num,
    })
  },
  
  load(e) {
    const {index}=e.currentTarget.dataset
    let loading=this.data.loading
    loading[index]=0
    this.setData({
      loading:loading
    })
  }


})