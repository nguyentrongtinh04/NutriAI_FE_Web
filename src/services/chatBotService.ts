import axios from "axios";

const API_URL = "http://localhost:5010/api/chatbot"; // địa chỉ backend chatbot-service

// Gửi message từ user đến Chatbot API
export const sendMessageToBot = async (message: string) => {
  try {
    const res = await axios.post(API_URL, { message });
    return res.data.reply;
  } catch (error: any) {
    console.error("ChatBot API Error:", error);
    return "⚠️ Xin lỗi, hệ thống tạm thời không phản hồi được.";
  }
};
