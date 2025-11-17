import { chatbotApi } from "./api";

export const chatBotService = {
  sendMessageToBot: async (message: string) => {
    try {
      const res = await chatbotApi.post("", { message });
      return res.data.reply;
    } catch {
      return "⚠️ Xin lỗi, hệ thống tạm thời không phản hồi được.";
    }
  },
};
