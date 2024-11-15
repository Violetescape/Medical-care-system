const db = wx.cloud.database(); // 获取云开发数据库实例
const userCollection = db.collection('users'); // 用户数据集合
const familyCollection = db.collection('Family'); // 子女数据集合

Page({
    data: {
        amount: "",
        date: "", // 用于存储当前日期
        note: "",
        employeeId: "", // 职工号
        name: "", // 姓名
        department: "",
        expenseType: "", // 费用类型
        expenseTypeOptions: ['校内就诊', '校外就诊'], // 费用类型选项
        familyMembers: [], // 存储职工及其子女的姓名
        reimbursementType: "", // 报销人员类型
        reimbursementTypeOptions: ['职工', '职工子女'], // 报销人员类型选项
      },

  onLoad() {
    // 获取今天的日期
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    this.setData({
      date: formattedDate, // 将今天的日期设置为默认值
    });
    this.loadUserInfo(); // 加载用户信息以获取职工号
  },

  // 加载用户信息以获取职工号
  loadUserInfo() {
    const app = getApp();
    userCollection.doc(app.globalData.currentEmployeeId).get({
      success: res => {
        const employeeId = res.data.employeeId; // 从数据库记录中获取职工号
        this.setData({
          employeeId,
        });
        this.loadFamilyMembers(); // 加载职工及其子女的姓名
      },
      fail: err => {
        console.error('加载用户信息失败', err);
        wx.showToast({
          title: '加载用户信息失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 加载职工及其子女的姓名
  loadFamilyMembers() {
    const app = getApp();
    familyCollection.where({
      parent_id: app.globalData.currentEmployeeId
    }).get({
      success: res => {
        const familyMembers = [getApp().globalData.currentEmployeeName]; // 默认包括职工本人
        if (res.data.length > 0) {
          res.data.forEach(item => {
            familyMembers.push(item.children_name); // 添加子女姓名
          });
        }
        this.setData({ familyMembers });
      },
      fail: err => {
        console.error('加载家庭成员失败', err);
        wx.showToast({
          title: '加载家庭成员信息失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onAmountChange(event) {
    this.setData({ amount: event.detail.value });
  },

  onNoteChange(event) {
    this.setData({ note: event.detail.value });
  },

  onNameChange(event) {
    this.setData({ name: this.data.familyMembers[event.detail.value] });
  },

  onDepartmentChange(event) {
    this.setData({ department: event.detail.value });
  },

  onExpenseTypeChange(event) {
    this.setData({ expenseType: this.data.expenseTypeOptions[event.detail.value] });
  },

  onReimbursementTypeChange(event) {
    this.setData({ reimbursementType: this.data.reimbursementTypeOptions[event.detail.value] });
  },
  submitApplication() {
    if (!this.data.amount || !this.data.employeeId || !this.data.name || !this.data.department || !this.data.expenseType || !this.data.reimbursementType) {
      wx.showToast({
        title: "请填写所有必填项",
        icon: "none"
      });
      return;
    }
  
    // 获取报销规则
    this.getReimbursementRules(this.data.reimbursementType).then(rules => {
      const dataToAdd = {
        amount: this.data.amount,
        date: this.data.date, // 自动填充的当前日期
        note: this.data.note,
        employeeId: this.data.employeeId,
        name: this.data.name,
        department: this.data.department,
        expenseType: this.data.expenseType,
        reimbursementType: this.data.reimbursementType, // 添加报销人员类型字段
        Success_Amount: rules.Success_Amount, // 根据reimbursementType添加相应的Success_Amount
        Success_Ratio: rules.Success_Ratio, // 根据reimbursementType添加相应的Success_Ratio
        status: 1 // 保持数值化状态字段，1表示“待审核”
      };
  
      db.collection('Reimbursement_Requests').add({
        data: dataToAdd,
        success: (res) => {
          const reimbursementId = res._id; // 获取提交后的报销申请 ID
          wx.showToast({
            title: "申请已提交",
            icon: "success"
          });
  
          // 清空表单数据
          this.setData({
            amount: "",
            note: "",
            name: "",
            department: "",
            expenseType: "",
            reimbursementType: "", // 清空报销人员类型字段
          });
  
          // 生成消息通知用户
          this.createMessage(reimbursementId);
        },
        fail: (err) => {
          wx.showToast({
            title: "提交失败",
            icon: "none"
          });
        }
      });
    }).catch(err => {
      console.error('获取报销规则失败', err);
      wx.showToast({
        title: "获取报销规则失败",
        icon: "none"
      });
    });
  },
  
  // 获取报销规则
  getReimbursementRules(reimbursementType) {
    return new Promise((resolve, reject) => {
      const rulesCollection = db.collection('Reimbursement_rules');
      rulesCollection.doc('7f296b216735a649011d91ab6cba44a8').get().then(res => {
        const rules = res.data;
        let successAmount, successRatio;
  
        if (reimbursementType === '职工') {
          successAmount = rules.Amount_reimbursement;
          successRatio = rules.Excess_reimbursement_ratio;
        } else if (reimbursementType === '职工子女') {
          successAmount = rules.Children_amount;
          successRatio = rules.Children_ratio;
        }
  
        resolve({ Success_Amount: successAmount, Success_Ratio: successRatio });
      }).catch(err => {
        reject(err);
      });
    });
  },
  
  // 创建消息通知用户查询 ID
  createMessage(reimbursementId) {
    const messageData = {
      text: `您的报销申请已提交成功，查询 ID 为：${reimbursementId}，当前状态：待审核`,
      timestamp: Date.now()
    };
  
    db.collection('Messages').add({
      data: messageData,
      success: () => {
        console.log('消息已成功添加');
      },
      fail: (err) => {
        console.error('消息添加失败', err);
      }
    });
  },
});