'use strict';

exports.main = async (event, context) => {
  console.log("Function is invoked");
  console.log("Event: ", event);
  console.log("Context: ", context);

  try {
    // 调用工作流
    const result = await cloud.callFunction({
      name: 'lowcode-wx-datasource',
      data: {
        action: 'StartFlowInstance',
        actionData: {
          FlowId: 'sh_o9qzjxe2', // 替换为您的工作流ID
          Params: event.params || {} // 从事件中获取参数，如果没有则为空对象
        }
      }
    });
    console.log('工作流调用成功', result);
    return result; // 返回工作流调用结果
  } catch (e) {
    // 打印并返回错误信息
    console.error('工作流调用失败', e);
    return { error: '工作流调用失败', message: e.message };
  }
};