export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "只支持 POST 请求" });
  const { keywords } = req.body;
  if (!keywords || !keywords.trim()) return res.status(400).json({ error: "关键词不能为空" });

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
          messages: [{
            role: "user",
            content: `你是一个产品创意专家，专注于帮助独立开发者和 AI Builder 发现有潜力的轻量产品机会。

根据关键词「${keywords}」，生成 5 个有变现潜力的产品 idea。

只返回合法 JSON，不要有任何多余文字或代码块标记。
格式如下：
{
  "summary": "一句话概括这组 idea 的共同特点和机会方向",
  "ideas": [
    {
      "title": "产品标题",
      "whyItMatters": "为什么值得做：一句加粗的核心价值判断，说明市场机会",
      "description": "产品描述，最多两句话，简洁有力",
      "difficulty": "easy",
      "devTime": "2周",
      "targetUser": "目标用户，一句话",
      "painPoint": "核心痛点，一句话",
      "mvpPlan": "最小可行版本做法，具体可执行",
      "monetization": "变现方式，一句话",
      "builderTake": "如果你是独立开发者，这个值不值得做，给出判断和建议",
      "riskWarning": "这个方向的主要风险是什么，一句话",
      "competitorLandscape": "市场上已有谁在做，差异化切入点在哪",
      "ideaType": "工具型",
      "revenueModel": "订阅制",
      "relatedKeywords": ["相关关键词1", "相关关键词2", "相关关键词3"]
    }
  ]
}

字段规则：
- difficulty 只能是 easy、medium、hard
- devTime 用中文，如 "1周"、"2周"、"1个月"
- ideaType 只能是 "工具型"、"内容型"、"平台型"、"服务型"
- revenueModel 只能是 "订阅制"、"一次性付费"、"广告变现"、"佣金抽成"、"免费增值"
- relatedKeywords 是 3 个相关关键词的数组
- builderTake 要有主观判断，不是泛泛而谈
- riskWarning 要具体，不要笼统
- competitorLandscape 要提到具体产品或平台名称`,
          }],
        }),
      }
    );
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("没有返回内容");
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "生成失败：" + err.message });
  }
}
