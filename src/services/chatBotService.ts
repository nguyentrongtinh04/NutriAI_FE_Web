import { chatbotApi } from "./api";

export const chatBotService = {
  sendMessageToBot: async (message: string) => {
    try {
      // POST tới Gateway: /chatbot/
      const res = await chatbotApi.post("/question", { message });

      return res.data.reply;
    } catch (err) {
      console.error("Chatbot error:", err);
      return "⚠️ Xin lỗi, hệ thống tạm thời không phản hồi được.";
    }
  },
};
