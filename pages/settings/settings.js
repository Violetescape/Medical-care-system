Page({
  data: {
    isNotificationEnabled: false,
    selectedLanguage: '简体中文'
  },

  toggleNotification(event) {
    this.setData({ isNotificationEnabled: event.detail.value });
  },

  onLanguageChange(event) {
    const selectedLanguage = this.data.languageOptions[event.detail.value];
    this.setData({ selectedLanguage });
  }
});
