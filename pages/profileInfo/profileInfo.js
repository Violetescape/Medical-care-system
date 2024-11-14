Page({
  data: {
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
    nickname: ''  // 默认昵称为空
  },

  // 头像选择事件
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl  // 更新头像
    });
  },

  // 昵称输入事件
  onNicknameInput(e) {
    const nickname = e.detail.value;
    this.setData({
      nickname  // 更新昵称
    });
  }
})
