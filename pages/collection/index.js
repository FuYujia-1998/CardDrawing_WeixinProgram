// pages/collection/index.js
Page({

  data: {
    currentindex: 0,
    currentsrc: '',
    currentnum: '',
    card: [],
    scrolltop: 0,
    curentcardnum: 119,
    loadsrc: '../../icons/loading.gif',
    menu: ['全部', 'ssr', 'sr', 'r', '春卷', '昊昊', '昊哥', '黄姐', '妙妙', '小佳寺町', '萱萱', '佳佳'],
    loading:[],
  },
  card: [],
  cardnum: [119, 25, 26, 68, 8, 17, 29, 12, 10, 4, 10, 29],
  onLoad: function(options) {
    
  },
  onLoad(){
    this.card = wx.getStorageSync('mycard')
    let l=this.card.length
    let loading=[]
    for(let i=0;i<l;i++){
      loading[i]=1
    }
    this.setData({
      card: this.card,
      loading: loading
    })
  },
  onShow() {
    this.setData({
      scrolltop: 0,
    })

    this.card= wx.getStorageSync('mycard')
    let newcard
    if (this.data.currentindex == 0) {
      newcard = this.card
    } else {
      newcard = this.setcard(this.data.menu[this.data.currentindex])
    }
  
    
    console.log(this.card)
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
      newcard = this.setcard(name)
    }
    this.setData({
      currentindex: index,
      card: newcard,
      curentcardnum: this.cardnum[index],
      scrolltop: 0
    })
  },

  setcard(name) {
    function has(element) {

      return (element.charactor == name || element.rank == name)
    }
    let card = this.card.filter(has)
    return card
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