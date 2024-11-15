Component({
  properties: {
    backgroundColor: {
      type: String,
      value: '#ffffff'
    },
    color: {
      type: String,
      value: '#666666'
    },
    selectedColor: {
      type: String,
      value: '#4CAF50'
    },
    list: {
      type: Array,
      value: [
        {
          "pagePath": "pages/messages/messages",
          "text": "消息",
          "iconPath": "/components/tabbar/images/messages.png",
          "selectedIconPath": "/components/tabbar/images/messages_active.png"
        },
        {
          "pagePath": "pages/home/home",
          "text": "主页",
          "iconPath": "/components/tabbar/images/home.png",
          "selectedIconPath": "/components/tabbar/images/home_active.png"
        },
        {
          "pagePath": "pages/profile/profile",
          "text": "我的",
          "iconPath": "/components/tabbar/images/profile.png",
          "selectedIconPath": "/components/tabbar/images/profile_active.png"
        }
      ]
    },
    selected: {
      type: Number,
      value: 1 // 默认选中“主页”
    }
  },

  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      if (pages.length === 0) {
        console.error("当前页面栈为空，无法获取路径");
        return;
      }

      const currentPage = pages[pages.length - 1];
      const currentPath = `/${currentPage.route}`;
      console.log('当前页面路径:', currentPath);

      const selectedIndex = this.data.list.findIndex(item => {
        return item.pagePath === currentPath;
      });

      if (selectedIndex !== -1) {
        this.setData({ selected: selectedIndex });
      } else {
        console.warn("未找到匹配的导航项");
      }
    }
  },

  methods: {
    switchTab(event) {
      const index = event.currentTarget.dataset.index;
      const path = this.data.list[index].pagePath;

      if (this.data.selected !== index) {
        wx.switchTab({
          url: `/${path}`,
          fail: (err) => {
            console.error("跳转失败:", err);
          }
        });
        this.setData({ selected: index });
      }
    }
  }
});
