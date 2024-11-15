Component({
  data: {
    list: [
      {
        pagePath: "/pages/home/home",
        text: "主页",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home-active.png"
      },
      {
        pagePath: "/pages/messages/messages",
        text: "消息",
        iconPath: "/images/messages.png",
        selectedIconPath: "/images/messages-active.png"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        iconPath: "/images/profile.png",
        selectedIconPath: "/images/profile-active.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      wx.switchTab({ url: path });
    }
  }
});
