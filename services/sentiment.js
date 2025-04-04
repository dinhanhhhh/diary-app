// services/emotionAnalysis.js
function analyzeEmotion(content) {
  content = content.toLowerCase();
  if (content.includes("vui") || content.includes("hạnh phúc"))
    return "positive"; // tương ứng với cảm xúc tích cực
  if (
    content.includes("buồn") ||
    content.includes("đau lòng") ||
    content.includes("giận") ||
    content.includes("tức giận")
  )
    return "negative"; // tương ứng với cảm xúc tiêu cực
  return "neutral"; // mặc định là trung tính
}

module.exports = { analyzeEmotion };
