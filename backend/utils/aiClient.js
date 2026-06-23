const axios = require('axios');

const AI_URL = "https://llm-wrapper-741152993481.asia-south1.run.app/llm/query";
const TOKEN = process.env.AI_TOKEN;

async function queryAI(prompt, pdfBase64=null) {
  const body = { prompt };
  if (pdfBase64) body.pdfBase64 = pdfBase64;

  const res = await axios.post(AI_URL, body, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`
    }
  });
  return res.data;
}

module.exports = { queryAI };
