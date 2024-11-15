Component({
  data: {
    selected: 1, // "主页" initially selected
    list: [
      {
        pagePath: "/pages/messages/messages",
        text: "消息",
        iconPath: "/images/messages.png",
        selectedIconPath: "/images/messages_active.png"
      },
      {
        pagePath: "/pages/home/home",
        text: "主页",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home_active.png"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        iconPath: "/images/profile.png",
        selectedIconPath: "/images/profile_active.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ selected: index });
      wx.switchTab({ url: this.data.list[index].pagePath });
    }
  }
});
