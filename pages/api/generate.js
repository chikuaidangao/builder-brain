export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { keywords } = req.body;
  if (!keywords || !keywords.trim()) {
    return res.status(400).json({ error: "关键词不能为空" });
  }

  try {
    const response = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            {
              role: "user",
              content: `你是一个产品创意专家。根据关键词「${keywords}」，生成 5 个产品创意。
只返回合法 JSON，不要有任何多余的文字或代码块标记。
格式如下：
[
  {
    "title": "产品标题",
    "description": "产品描述，最多两句话",
    "difficulty": "easy",
    "monetization": "变现方式，一句话"
  }
]
difficulty 只能是 easy、medium、hard 三个值之一。`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) throw new Error("没有返回内容");

    const clean = text.replace(/```json|```/g, "").trim();
    const ideas = JSON.parse(clean);

    return res.status(200).json({ ideas });
  } catch (err) {
    return res.status(500).json({ error: "生成失败：" + err.message });
  }
}
