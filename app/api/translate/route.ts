import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("------------------------------------------------");
  console.log("✅ 后端收到请求，准备处理...");

  try {
    // 1. 获取 API Key
    // 优先从环境变量获取，如果没有（比如调试时），也可以临时在代码里硬编码
    const apiKey = process.env.GEMINI_API_KEY;

    // 🔍 【调试】打印 Key 的前 10 位，确保读到了你的新 Key (AIzaSyDOD...)
    console.log("🔑 当前使用的 Key:", apiKey ? apiKey.substring(0, 10) + "..." : "❌ 未找到 Key");

    if (!apiKey) {
      return NextResponse.json({ error: "API Key 丢失，请检查 .env.local" }, { status: 500 });
    }

    // 2. 接收前端传来的数据
    const body = await request.json();
    const { prompt, imageParts } = body;

    // 3. 初始化模型
    // 🔥 关键修改：使用最新的 gemini-2.5-flash
    // 这个模型速度极快，且支持多模态（图片/文字）
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. 发送给 Google 并等待结果
    console.log("📡 正在连接 Google Gemini (模型: gemini-2.5-flash)...");
    
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    console.log("🎉 翻译成功！长度:", text.length);
    console.log("------------------------------------------------");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("💥 后端报错:", error);
    
    // 返回详细错误信息给前端，方便排查
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}