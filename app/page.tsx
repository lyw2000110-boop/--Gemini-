"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 处理图片选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult(""); // 清空旧结果
    }
  };

  // 点击翻译按钮
  const handleTranslate = async () => {
    if (!image) return alert("请先上传一张图片！");
    
    setLoading(true);
    setResult("");

    try {
      // 1. 读取图片文件转 Base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(",")[1];
        
        // 2. 发送给后端
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // 提示词：你可以随意修改这里的中文要求
            prompt: "请将这张图片里的漫画文字翻译成中文。请直接输出翻译后的文本，不需要任何开场白或解释。", 
            imageParts: [{ inlineData: { data: base64data, mimeType: image.type } }]
          }),
        });

        // 3. 处理结果
        const data = await response.json();
        
        if (response.ok) {
          setResult(data.text);
        } else {
          // 如果出错，弹窗显示错误信息
          alert("翻译失败: " + (data.error || response.statusText));
        }
        setLoading(false);
      };
    } catch (error) {
      console.error("前端报错:", error);
      alert("网络请求出错，请检查控制台");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Manga Translator (v1.5 Flash)</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        {/* 图片上传 */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {/* 预览图 */}
        {image && (
          <div className="mb-4 flex justify-center">
            <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
          </div>
        )}

        {/* 按钮 */}
        <button
          onClick={handleTranslate}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold transition-all
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {loading ? "正在连接 Google..." : "开始翻译 🚀"}
        </button>

        {/* 结果显示 */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">翻译结果：</h3>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}