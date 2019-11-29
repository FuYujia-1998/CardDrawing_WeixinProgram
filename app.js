
wx-App({
  globalData: {
    originmoney:100,
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'hmh48-j2coo'
    })
    this.getcardset('card_ssr')
    this.getcardset('card_sr')
    this.getcardset('card_r')
  },
  getcardset(name){
    let mycard=wx.getStorageSync(name)
    if(!mycard){
      wx.cloud.callFunction({
        name:'getonerankcard',
        data:{
          name:name
        }
      }).then(res=>{
        let mycard=res.result.data
        wx.setStorageSync(name, mycard)
        console.log("云端读取" + name, mycard)
      })
      }else{
      console.log(name+"已储存")
      }
  }


})
