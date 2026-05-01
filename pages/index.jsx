import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import IdeaCard from '../components/IdeaCard';

// ═══════════════════════════════════════════════════════
// AI SaaS 高级感设计系统（Calm Tech）
// ═══════════════════════════════════════════════════════

const T = {
  // ─── 配色：低饱和雾化 + 点状高亮 ───
  bg:         '#F7F8FC',   // 主背景（冷灰白）
  bgCard:     '#FFFFFF',   // 卡片背景
  bgSubtle:   '#F0F1F6',   // 次级背景
  bgWarm:     '#FFF9F0',   // 暖色点缀区
  bgCool:     '#F0F4FF',   // 冷色点缀区
  bgMint:     '#F0FAF5',   // 绿色点缀区

  text:       '#1A1D2E',   // 主文字（深蓝灰）
  textSec:    '#6B7194',   // 次级文字
  textTert:   '#9CA3C4',   // 三级文字
  textFaint:  '#C5CBE0',   // 极淡文字

  accent:     '#6366F1',   // 主强调色（Indigo）
  accentSoft: '#EEF0FF',   // 强调色浅底
  accentHover:'#4F46E5',   // 强调色 hover

  green:      '#10B981',   // 正向/成功
  greenSoft:  '#ECFDF5',
  amber:      '#F59E0B',   // 提示/中等
  amberSoft:  '#FFFBEB',
  rose:       '#F43F5E',   // 警告/困难
  roseSoft:   '#FFF1F3',
  blue:       '#3B82F6',   // 信息/稳定
  blueSoft:   '#EFF6FF',

  border:     '#E5E7F0',   // 边框
  borderLight:'#F0F1F6',   // 极淡边框

  // ─── 阴影体系 ───
  shadow1:    '0 1px 3px rgba(26,29,46,0.04), 0 1px 2px rgba(26,29,46,0.03)',
  shadow2:    '0 4px 12px rgba(26,29,46,0.06), 0 2px 4px rgba(26,29,46,0.04)',
  shadow3:    '0 12px 32px rgba(26,29,46,0.10), 0 4px 8px rgba(26,29,46,0.06)',

  // ─── 圆角体系 ───
  rSm:  8,
  rMd:  16,
  rLg:  20,
  rXl:  24,
  rFull:'9999px',

  // ─── 字体 ───
  font: "'Urbanist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  // ─── 动效 ───
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  dur:  '200ms',
  durSlow: '300ms',
};

// ─── 数据 ───────────────────────────────────────────
const QUICK_DIRECTIONS = ['AI副业', '小红书', '电商', '设计工具', '自动化', '效率工具'];

const TRENDS = [
  { category: '内容创作', icon: '✍️', color: T.accentSoft, items: [
    { title: 'AI 小红书封面生成器', desc: '一键生成爆款笔记封面，自动匹配热门排版', tags: ['工具型', '简单', '订阅制'], kw: 'AI小红书封面' },
    { title: 'AI 短视频脚本助手', desc: '输入主题自动生成抖音/快手短视频分镜脚本', tags: ['内容型', '中等', '免费增值'], kw: 'AI短视频脚本' },
    { title: '自动视频剪辑工具', desc: '上传素材自动识别高光时刻，一键出片', tags: ['工具型', '中等', '订阅制'], kw: '自动视频剪辑' },
    { title: '爆款标题生成器', desc: '基于千万篇爆款内容训练，生成高点击率标题', tags: ['工具型', '简单', '一次性付费'], kw: '爆款标题生成' },
  ]},
  { category: '副业赚钱', icon: '💰', color: T.greenSoft, items: [
    { title: 'AI 数字产品工坊', desc: '自动生成电子书、课程大纲、模板等可售卖数字产品', tags: ['工具型', '中等', '订阅制'], kw: 'AI数字产品' },
    { title: '自动接单助手', desc: '监控多个自由职业平台，自动匹配和投标适合的项目', tags: ['工具型', '中等', '佣金抽成'], kw: '自动接单平台' },
    { title: '知识付费课程打包器', desc: '将你的专业知识自动拆解为可售卖的系列课程', tags: ['内容型', '简单', '一次性付费'], kw: '知识付费课程' },
    { title: '订阅制工具聚合平台', desc: '帮用户发现和管理各种 SaaS 订阅，赚取推荐佣金', tags: ['平台型', '困难', '佣金抽成'], kw: '订阅制工具聚合' },
  ]},
  { category: '电商', icon: '🛒', color: T.amberSoft, items: [
    { title: 'AI 商品图生成', desc: '无需实拍，AI 生成专业级电商产品展示图', tags: ['工具型', '简单', '订阅制'], kw: 'AI商品图生成' },
    { title: '评论情感分析工具', desc: '自动分析竞品评论，提取用户痛点和需求', tags: ['工具型', '中等', '订阅制'], kw: '电商评论分析' },
    { title: 'AI 选品助手', desc: '基于销量趋势和社交媒体热度，智能推荐蓝海产品', tags: ['工具型', '中等', '订阅制'], kw: 'AI选品工具' },
    { title: '广告素材 A/B 工厂', desc: '批量生成广告文案和图片素材，自动测试最优方案', tags: ['工具型', '中等', '广告变现'], kw: '广告素材生成' },
  ]},
  { category: '效率工具', icon: '⚡', color: T.blueSoft, items: [
    { title: 'AI 自动日报生成', desc: '连接你的工具链，自动汇总每日工作进展生成日报', tags: ['工具型', '简单', '订阅制'], kw: 'AI自动日报' },
    { title: '邮件智能总结', desc: '自动分类、摘要、提取待办事项，告别邮件焦虑', tags: ['工具型', '简单', '免费增值'], kw: '邮件智能总结' },
    { title: '会议纪要自动生成', desc: '语音转文字 + AI 提取决议和待办，会后秒出纪要', tags: ['工具型', '中等', '订阅制'], kw: '会议纪要自动生成' },
    { title: 'AI 任务拆解器', desc: '输入一个大目标，自动拆解为可执行的子任务和时间线', tags: ['工具型', '简单', '免费增值'], kw: 'AI任务拆解' },
  ]},
];

const FEATURED = [
  { label: '本周值得关注', accent: T.accent, bg: T.accentSoft, items: [
    { title: 'AI Agent 搭建平台', desc: '零代码搭建自定义 AI Agent，让 AI 自动完成重复工作', tags: ['工具型', '简单'], kw: 'AI Agent搭建平台' },
    { title: '知识付费变现工具', desc: '从内容创作到售卖一站式解决，支持课程/专栏/社群', tags: ['平台型', '中等'], kw: '知识付费变现工具' },
    { title: '出海工具箱', desc: '一键翻译、多平台发布、海外社媒管理，助力产品出海', tags: ['工具型', '中等'], kw: '出海工具箱' },
  ]},
  { label: '适合新手', accent: T.green, bg: T.greenSoft, items: [
    { title: '小红书运营助手', desc: '自动生成笔记文案、排版建议、发布时间优化', tags: ['工具型', '简单'], kw: '小红书运营助手' },
    { title: 'AI 简历优化器', desc: '根据目标岗位自动优化简历，提升面试通过率', tags: ['工具型', '简单'], kw: 'AI简历优化' },
    { title: '自动日报生成器', desc: '一句话描述今天做了什么，自动生成专业日报', tags: ['工具型', '简单'], kw: '自动日报生成器' },
  ]},
  { label: '更容易变现', accent: T.amber, bg: T.amberSoft, items: [
    { title: 'SaaS 订阅制模板', desc: '提供现成的 SaaS 产品模板，改改就能上线收费', tags: ['工具型', '中等'], kw: 'SaaS订阅制模板' },
    { title: 'AI 变现工具合集', desc: '整合多种 AI 能力的变现工具包，开箱即用', tags: ['工具型', '简单'], kw: 'AI变现工具合集' },
    { title: '数字产品自动生成', desc: 'AI 批量生成电子书、PPT 模板、Notion 模板等', tags: ['内容型', '简单'], kw: '数字产品自动生成' },
  ]},
];

const RANDOM_KEYWORDS = ['AI + 副业 + 自动化', '小红书 + 电商 + 选品', '设计工具 + SaaS', '效率工具 + 订阅', 'AI + 内容创作', '电商 + AI + 广告'];

const SAMPLE_RESULTS = [
  { title: 'AI 语音备忘录', difficulty: 'easy', revenueModel: '订阅制', devTime: '2周', ideaType: '工具型', whyItMatters: '为忙碌人士提供快速记录和整理日程信息的工具，市场需求广泛。', description: '通过AI技术自动转录语音内容，让用户可以随时随地记录要点。', targetUser: '职场白领、学生', painPoint: '在会议或重要谈话中总是忘记记录重要信息。', builderTake: '非常值得尝试，市场前景广阔。', riskWarning: '技术实现难度不高，但需关注转录准确率。', competitorLandscape: '已有讯飞听见等产品，需要开发独特的用户体验。', mvpPlan: '开发基础的语音录制和文字转录功能。', monetization: '订阅制', relatedKeywords: ['语音转文字', 'AI笔记', '会议记录'] },
  { title: 'AI 学习助手', difficulty: 'medium', revenueModel: '订阅制', devTime: '1个月', ideaType: '内容型', whyItMatters: '为自学人士提供个性化学习建议和管理课程安排。', description: '根据用户的学习进度、偏好提供课程推荐及学习计划。', targetUser: '成人自学者、学生', painPoint: '处理众多学习材料不知如何选择和安排。', builderTake: '很有前景，用户对优质个性化服务的需求大。', riskWarning: '内容资源需要持续更新。', competitorLandscape: '网易云课堂、腾讯课堂等平台，着重于细化个性化体验。', mvpPlan: '建立包含不同学习材料和课程的数据库，用户可以选择课程进行个性化学习。', monetization: '订阅制', relatedKeywords: ['在线学习', '教育科技', '个性化学习'] },
  { title: 'AI 兼职时间助手', difficulty: 'easy', revenueModel: '佣金抽成', devTime: '2周', ideaType: '工具型', whyItMatters: '帮助兼职人士优化时间管理，找到最合适的兼职项目。', description: '结合用户个人资料，智能推荐最适合的兼职工作。', targetUser: '自由职业者、兼职者', painPoint: '找不到合适且赚钱的兼职岗位。', builderTake: '解决自由职业者的信息需求。', riskWarning: '兼职信息更新需跟高速发展变化的社会。', competitorLandscape: '58同城兼职、BOSS直聘', mvpPlan: '收集并整理各类兼职信息，实现信息匹配。', monetization: '佣金抽成', relatedKeywords: ['兼职推荐', '时间管理', '工作匹配'] },
];

const HOW_IT_WORKS = [
  { step: '01', title: '输入方向', desc: '告诉我们你感兴趣的领域、技术或市场', icon: '💬' },
  { step: '02', title: 'AI 分析', desc: 'AI 扫描市场趋势、竞争格局和用户痛点', icon: '🧠' },
  { step: '03', title: '获取创意', desc: '获得 5 个可落地的产品方案，含 MVP 计划和变现路径', icon: '🚀' },
];

// ─── 骨架屏组件 ──────────────────────────────────────
function ShimmerCard() {
  const baseStyle = { borderRadius: T.rSm, background: 'linear-gradient(90deg, #F0F1F6 25%, #E8EAF2 50%, #F0F1F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' };
  return (
    <div style={{ background: T.bgCard, borderRadius: T.rMd, padding: 24, boxShadow: T.shadow1 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[80, 60, 50].map((w, i) => <div key={i} style={{ ...baseStyle, width: w, height: 24, borderRadius: T.rFull }} />)}
      </div>
      <div style={{ ...baseStyle, width: '60%', height: 24, marginBottom: 12 }} />
      <div style={{ ...baseStyle, width: '100%', height: 16, marginBottom: 8 }} />
      <div style={{ ...baseStyle, width: '80%', height: 16, marginBottom: 8 }} />
      <div style={{ ...baseStyle, width: '40%', height: 16 }} />
    </div>
  );
}

// ─── 对比视图组件 ────────────────────────────────────
function ComparisonView({ ideas }) {
  const difficultyMap = {
    easy: { label: '简单', width: 30, color: T.green, bg: T.greenSoft },
    medium: { label: '中等', width: 55, color: T.amber, bg: T.amberSoft },
    hard: { label: '困难', width: 80, color: T.rose, bg: T.roseSoft },
  };
  const monetMap = {
    '高': { width: 80, color: T.accent },
    '中': { width: 55, color: T.accent },
    '低': { width: 30, color: T.accent },
  };
  function getMonetLevel(idea) {
    const m = (idea.monetization || '').toLowerCase();
    if (m.includes('订阅') || m.includes('高') || m.includes('强')) return '高';
    if (m.includes('广告') || m.includes('中')) return '中';
    return '低';
  }
  return (
    <div style={{ background: T.bgCard, borderRadius: T.rMd, padding: '24px 28px', boxShadow: T.shadow1, marginBottom: 32, maxWidth: 680, margin: '0 auto 32px', border: `1px solid ${T.borderLight}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0, fontFamily: T.font }}>对比视图</h3>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: T.textTert }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: T.greenSoft, marginRight: 4, verticalAlign: 'middle' }} />开发难度</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: T.accentSoft, marginRight: 4, verticalAlign: 'middle' }} />变现潜力</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ideas.map((idea, i) => {
          const diff = difficultyMap[idea.difficulty] || difficultyMap.medium;
          const monLevel = getMonetLevel(idea);
          const mon = monetMap[monLevel] || monetMap['中'];
          return (
            <div key={i}>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: '0 0 6px', fontFamily: T.font }}>{idea.title}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: T.bgSubtle, borderRadius: T.rFull, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${diff.width}%`, background: diff.bg, borderRadius: T.rFull, transition: `width ${T.durSlow} ${T.ease}` }} />
                  </div>
                  <span style={{ fontSize: 10, color: diff.color, fontWeight: 600 }}>{diff.label}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: T.bgSubtle, borderRadius: T.rFull, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${mon.width}%`, background: T.accentSoft, borderRadius: T.rFull, transition: `width ${T.durSlow} ${T.ease}` }} />
                  </div>
                  <span style={{ fontSize: 10, color: mon.color, fontWeight: 600 }}>{monLevel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 微交互按钮 ──────────────────────────────────────
function PillButton({ children, onClick, variant = 'default', style: customStyle = {} }) {
  const base = {
    fontSize: 13, fontWeight: 600, fontFamily: T.font,
    padding: '8px 18px', borderRadius: T.rFull,
    border: 'none', cursor: 'pointer',
    transition: `all ${T.dur} ${T.ease}`,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  };
  const variants = {
    default: { background: T.bgSubtle, color: T.textSec, border: `1px solid ${T.border}` },
    primary: { background: T.accent, color: '#fff' },
    ghost: { background: 'transparent', color: T.textSec },
    outline: { background: 'transparent', color: T.accent, border: `1px solid ${T.border}` },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...customStyle }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        if (variant === 'primary') e.currentTarget.style.background = T.accentHover;
        else if (variant === 'default') e.currentTarget.style.boxShadow = T.shadow2;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (variant === 'primary') e.currentTarget.style.background = T.accent;
        else if (variant === 'default') e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </button>
  );
}

// ─── 主组件 ──────────────────────────────────────────
export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searches, setSearches] = useState([]);
  const [view, setView] = useState('home');
  const [filterType, setFilterType] = useState('全部');
  const [showSample, setShowSample] = useState(false);
  const heroInputRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) { fetchFavorites(); fetchSearches(); } }, [user]);

  async function fetchFavorites() {
    const { data } = await supabase.from('favorites').select('*').order('created_at', { ascending: false });
    setFavorites(data || []);
  }
  async function fetchSearches() {
    const { data } = await supabase.from('searches').select('*').order('created_at', { ascending: false }).limit(30);
    setSearches(data || []);
  }

  async function handleGenerate(kw) {
    const query = kw || keywords;
    if (!query.trim()) return;
    setKeywords(query);
    setLoading(true); setError(''); setIdeas([]); setSummary(''); setView('results'); setShowSample(false);
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keywords: query }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '请求失败');
      setIdeas(data.ideas || []);
      setSummary(data.summary || '');
      if (user) { await supabase.from('searches').insert({ user_id: user.id, keywords: query }); fetchSearches(); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  function handleRandom() { handleGenerate(RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)]); }
  function handleShare() { navigator.clipboard.writeText(`${window.location.origin}?keywords=${encodeURIComponent(keywords)}`); alert('链接已复制！'); }
  function handleKeywordClick(kw) { handleGenerate(kw); }
  async function toggleFavorite() { await fetchFavorites(); }

  useEffect(() => { const kw = new URLSearchParams(window.location.search).get('keywords'); if (kw) handleGenerate(kw); }, []);

  function groupSearchesByDate(list) {
    const today = new Date(); today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const groups = { '今天': [], '昨天': [], '更早': [] };
    list.forEach(s => { const d = new Date(s.created_at); if (d >= today) groups['今天'].push(s); else if (d >= yesterday) groups['昨天'].push(s); else groups['更早'].push(s); });
    return Object.entries(groups).filter(([,v]) => v.length > 0);
  }
  function formatTime(dateStr) { const d = new Date(dateStr); return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; }
  const filteredFavorites = filterType === '全部' ? favorites : favorites.filter(f => (f.idea_type || f.ideaType || '工具型') === filterType);

  const containerStyle = { maxWidth: 720, margin: '0 auto', padding: '0 24px' };

  // ═══════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>

      {/* ─── 全局 shimmer 动画 ─── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-in { animation: fadeInUp 0.4s ease-out both; }
        .animate-in-delay-1 { animation: fadeInUp 0.4s ease-out 0.1s both; }
        .animate-in-delay-2 { animation: fadeInUp 0.4s ease-out 0.2s both; }
        .animate-in-delay-3 { animation: fadeInUp 0.4s ease-out 0.3s both; }
      `}</style>

      {/* ─── 顶部导航 ─────────────────────────────── */}
      <nav style={{
        background: 'rgba(247,248,252,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${T.borderLight}`,
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setView('home')}>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Builder Brain</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {user ? (
              <>
                <NavButton onClick={() => setView('home')} active={view === 'home' || view === 'results'}>发现</NavButton>
                <NavButton onClick={() => setView('profile')} active={view === 'profile'}>收藏</NavButton>
                <NavButton onClick={() => setView('history')} active={view === 'history'}>历史</NavButton>
                <NavButton onClick={() => { supabase.auth.signOut(); setFavorites([]); setSearches([]); setView('home'); }}>退出</NavButton>
              </>
            ) : (
              <PillButton variant="outline" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                登录
              </PillButton>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ */}
      {/* 首页 — AI SaaS 高级感 6 区块 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'home' && (
        <div style={{ ...containerStyle, paddingBottom: 80 }}>

          {/* ━━━ 1. HERO ━━━ */}
          <div style={{ textAlign: 'center', paddingTop: 72, paddingBottom: 56 }} className="animate-in">
            <h1 style={{
              fontSize: 44, fontWeight: 700, margin: '0 0 20px', lineHeight: 1.2,
              color: T.text, letterSpacing: '-0.5px',
            }}>
              告别灵感枯竭
              <br />
              <span style={{ color: T.accent }}>让 AI 为你发现产品机会</span>
            </h1>
            <p style={{
              color: T.textSec, fontSize: 17, margin: '0 0 40px', lineHeight: 1.7,
              maxWidth: 500, marginLeft: 'auto', marginRight: 'auto',
            }}>
              输入你感兴趣的方向，AI 将分析市场趋势、竞争格局和用户痛点，为你生成可落地的产品方案
            </p>

            {/* 核心输入框 — AI 交互入口 */}
            <div style={{ maxWidth: 560, margin: '0 auto' }} className="animate-in-delay-1">
              <div style={{
                display: 'flex', gap: 0,
                background: T.bgCard, borderRadius: T.rLg,
                boxShadow: T.shadow2,
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
                transition: `box-shadow ${T.dur} ${T.ease}`,
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = T.shadow3}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = T.shadow2}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                  <input
                    ref={heroInputRef}
                    type='text'
                    placeholder='输入方向，如：AI + 小红书 + 电商'
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    style={{
                      flex: 1, padding: '18px 0', fontSize: 15, border: 'none', outline: 'none',
                      background: 'transparent', color: T.text, fontFamily: T.font,
                    }}
                  />
                </div>
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading || !keywords.trim()}
                  style={{
                    padding: '12px 28px', fontSize: 14, fontWeight: 700, marginRight: 6,
                    background: loading ? T.textTert : T.accent,
                    color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: T.font, borderRadius: T.rMd,
                    transition: `all ${T.dur} ${T.ease}`, whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? '生成中...' : '生成创意 →'}
                </button>
              </div>

              {/* 快捷方向标签 */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {QUICK_DIRECTIONS.map((d) => (
                  <button key={d} onClick={() => handleGenerate(d)} style={{
                    fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: T.rFull,
                    background: T.bgCard, color: T.textSec,
                    border: `1px solid ${T.border}`, cursor: 'pointer',
                    fontFamily: T.font, transition: `all ${T.dur} ${T.ease}`,
                    boxShadow: T.shadow1,
                  }} onMouseEnter={(e) => {
                    e.target.style.borderColor = T.accent;
                    e.target.style.color = T.accent;
                    e.target.style.background = T.accentSoft;
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                     onMouseLeave={(e) => {
                       e.target.style.borderColor = T.border;
                       e.target.style.color = T.textSec;
                       e.target.style.background = T.bgCard;
                       e.target.style.transform = 'translateY(0)';
                     }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ━━━ 2. AI 生成体验区（核心功能） ━━━ */}
          <div style={{ paddingBottom: 64 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }} className="animate-in">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: T.rFull, background: T.bgSubtle, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.textTert, letterSpacing: '1px', textTransform: 'uppercase' }}>Core Features</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', color: T.text, letterSpacing: '-0.5px' }}>
                不只是灵感，是完整的产品方案
              </h2>
              <p style={{ color: T.textSec, fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                每个创意都包含市场分析、MVP 计划、变现路径和风险评估
              </p>
            </div>

            {/* 3 列能力展示 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { icon: '🔍', title: '市场洞察', desc: '分析趋势、痛点和竞争格局', color: T.accentSoft, iconBg: T.accentSoft },
                { icon: '📐', title: 'MVP 方案', desc: '具体可执行的最小可行产品计划', color: T.greenSoft, iconBg: T.greenSoft },
                { icon: '💰', title: '变现路径', desc: '从 0 到 1 的商业化建议', color: T.amberSoft, iconBg: T.amberSoft },
              ].map((item, i) => (
                <div key={item.title} className={`animate-in-delay-${i + 1}`} style={{
                  textAlign: 'center', padding: '28px 20px', borderRadius: T.rMd,
                  background: T.bgCard, border: `1px solid ${T.borderLight}`,
                  boxShadow: T.shadow1,
                  transition: `all ${T.dur} ${T.ease}`,
                  cursor: 'default',
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = T.shadow2;
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = T.shadow1;
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: T.rMd, margin: '0 auto 16px',
                    background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>{item.icon}</div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: T.textSec, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ 3. 灵感模板区（降低使用门槛） ━━━ */}
          <div style={{ paddingBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: T.rFull, background: T.bgSubtle, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.textTert, letterSpacing: '1px', textTransform: 'uppercase' }}>Templates</span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: T.text, letterSpacing: '-0.5px' }}>
                  不知道做什么？从这里开始
                </h2>
              </div>
              <span style={{ fontSize: 12, color: T.textTert }}>点击卡片即刻生成</span>
            </div>

            {/* 今日推荐 3 列 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              {FEATURED.map((f) => (
                <div key={f.label} style={{
                  background: T.bgCard, borderRadius: T.rMd, padding: 20,
                  border: `1px solid ${T.borderLight}`, boxShadow: T.shadow1,
                  transition: `all ${T.dur} ${T.ease}`,
                }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = T.shadow2; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = T.shadow1; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.accent }} />
                    <p style={{ fontSize: 12, fontWeight: 700, color: f.accent, margin: 0, letterSpacing: '0.3px' }}>{f.label}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {f.items.map((item) => (
                      <button key={item.title} onClick={() => handleGenerate(item.kw)} style={{
                        background: T.bg, border: `1px solid ${T.borderLight}`, borderRadius: T.rSm,
                        padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                        transition: `all ${T.dur} ${T.ease}`,
                      }} onMouseEnter={(e) => {
                        e.target.style.borderColor = f.accent;
                        e.target.style.background = f.bg;
                        e.target.style.transform = 'translateX(2px)';
                      }}
                         onMouseLeave={(e) => {
                           e.target.style.borderColor = T.borderLight;
                           e.target.style.background = T.bg;
                           e.target.style.transform = 'translateX(0)';
                         }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 4px', lineHeight: 1.3 }}>{item.title}</p>
                        <p style={{ fontSize: 11, color: T.textSec, margin: '0 0 8px', lineHeight: 1.5 }}>{item.desc}</p>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {item.tags.map((tag) => (
                            <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: T.rFull, background: T.bgSubtle, color: T.textTert }}>{tag}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 热门趋势 2 列 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {TRENDS.map((t) => (
                <div key={t.category} style={{
                  background: T.bgCard, borderRadius: T.rMd, padding: 20,
                  border: `1px solid ${T.borderLight}`, boxShadow: T.shadow1,
                  transition: `all ${T.dur} ${T.ease}`,
                }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = T.shadow2; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = T.shadow1; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <p style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{t.category}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: T.rFull,
                      background: t.color, color: T.textSec,
                    }}>HOT</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {t.items.slice(0, 3).map((item) => (
                      <button key={item.title} onClick={() => handleGenerate(item.kw)} style={{
                        background: T.bg, border: `1px solid ${T.borderLight}`, borderRadius: T.rSm,
                        padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                        transition: `all ${T.dur} ${T.ease}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }} onMouseEnter={(e) => {
                        e.target.style.borderColor = T.accent;
                        e.target.style.background = T.accentSoft;
                      }}
                         onMouseLeave={(e) => {
                           e.target.style.borderColor = T.borderLight;
                           e.target.style.background = T.bg;
                         }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: '0 0 3px', lineHeight: 1.3 }}>{item.title}</p>
                          <p style={{ fontSize: 11, color: T.textSec, margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                        </div>
                        <span style={{ fontSize: 14, color: T.textTert, flexShrink: 0, marginLeft: 8 }}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ 4. 生成结果展示（建立信任） ━━━ */}
          <div style={{ paddingBottom: 64 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: T.rFull, background: T.bgSubtle, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.textTert, letterSpacing: '1px', textTransform: 'uppercase' }}>Preview</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', color: T.text, letterSpacing: '-0.5px' }}>
                你将获得这样的结果
              </h2>
              <p style={{ color: T.textSec, fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                以下是真实生成的创意示例，点击卡片展开查看完整方案
              </p>
            </div>

            {!showSample ? (
              <div style={{ textAlign: 'center' }}>
                {/* 预览卡片缩略 */}
                <div style={{
                  maxWidth: 480, margin: '0 auto 24px', padding: '32px 24px',
                  background: T.bgCard, borderRadius: T.rLg,
                  border: `1px solid ${T.borderLight}`, boxShadow: T.shadow1,
                  opacity: 0.6,
                }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {[60, 50, 40].map((w, i) => <div key={i} style={{ width: w, height: 22, borderRadius: T.rFull, background: T.bgSubtle }} />)}
                  </div>
                  <div style={{ width: '70%', height: 20, borderRadius: T.rSm, background: T.bgSubtle, marginBottom: 8 }} />
                  <div style={{ width: '100%', height: 14, borderRadius: T.rSm, background: T.bgSubtle, marginBottom: 6 }} />
                  <div style={{ width: '85%', height: 14, borderRadius: T.rSm, background: T.bgSubtle }} />
                </div>
                <PillButton variant="primary" onClick={() => setShowSample(true)} style={{ padding: '12px 32px', fontSize: 14 }}>
                  查看示例结果 ↓
                </PillButton>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {SAMPLE_RESULTS.map((idea, i) => (
                  <IdeaCard key={i} idea={idea} user={user} favorites={favorites} onFavChange={toggleFavorite} onKeywordClick={handleKeywordClick} />
                ))}
              </div>
            )}
          </div>

          {/* ━━━ 5. HOW IT WORKS ━━━ */}
          <div style={{ paddingBottom: 64 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: T.rFull, background: T.bgSubtle, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.textTert, letterSpacing: '1px', textTransform: 'uppercase' }}>How it works</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: T.text, letterSpacing: '-0.5px' }}>
                三步获得产品灵感
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.step} style={{ textAlign: 'center', position: 'relative' }}>
                  {/* 连接线 */}
                  {i < 2 && (
                    <div style={{
                      position: 'absolute', top: 32, right: '-12%', width: '24%', height: 1,
                      background: `linear-gradient(to right, ${T.border}, ${T.borderLight})`,
                    }} />
                  )}
                  <div style={{
                    width: 64, height: 64, borderRadius: T.rLg, margin: '0 auto 20px',
                    background: T.bgCard, border: `1px solid ${T.borderLight}`,
                    boxShadow: T.shadow1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    transition: `all ${T.dur} ${T.ease}`,
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = T.shadow2;
                      e.currentTarget.style.borderColor = T.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = T.shadow1;
                      e.currentTarget.style.borderColor = T.borderLight;
                    }}
                  >
                    {item.icon}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: T.accent, margin: '0 0 8px', letterSpacing: '1px' }}>STEP {item.step}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: T.textSec, margin: 0, lineHeight: 1.7, maxWidth: 200, marginLeft: 'auto', marginRight: 'auto' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ 6. CTA（再次引导生成） ━━━ */}
          <div style={{
            textAlign: 'center', padding: '56px 40px', borderRadius: T.rLg,
            background: T.bgCard,
            border: `1px solid ${T.borderLight}`,
            boxShadow: T.shadow1,
          }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 12px', color: T.text, lineHeight: 1.3, letterSpacing: '-0.3px' }}>
              你的下一个产品 idea
              <br />
              <span style={{ color: T.accent }}>可能就在这里</span>
            </h2>
            <p style={{ color: T.textSec, fontSize: 15, margin: '0 0 32px', lineHeight: 1.7 }}>
              每一次搜索，都是一次发现机会的过程
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <PillButton variant="primary" onClick={handleRandom} style={{ padding: '12px 32px', fontSize: 14 }}>
                随机生成一个创意
              </PillButton>
              <PillButton variant="outline" onClick={() => { setKeywords(''); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => heroInputRef.current?.focus(), 500); }} style={{ padding: '12px 32px', fontSize: 14 }}>
                自定义搜索
              </PillButton>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 搜索结果页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'results' && (
        <div style={{ ...containerStyle, paddingTop: 40, paddingBottom: 80 }}>
          <button onClick={() => setView('home')} style={{
            fontSize: 13, fontWeight: 600, color: T.textSec, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, marginBottom: 24, fontFamily: T.font,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: `color ${T.dur} ${T.ease}`,
          }} onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
             onMouseLeave={(e) => e.currentTarget.style.color = T.textSec}>
            ← 返回首页
          </button>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: T.textSec, fontWeight: 500 }}>关键词：</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>「{keywords}」</span>
            </div>
            {summary && (
              <div style={{
                background: T.accentSoft, borderRadius: T.rMd, padding: '16px 20px',
                borderLeft: `3px solid ${T.accent}`, lineHeight: 1.7, color: T.textSec, fontSize: 14,
              }}>{summary}</div>
            )}
          </div>
          {error && (
            <div style={{ color: T.rose, background: T.roseSoft, padding: '14px 18px', borderRadius: T.rMd, marginBottom: 24, fontSize: 14, border: `1px solid rgba(244,63,94,0.15)` }}>
              {error}
            </div>
          )}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 0' }}>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          )}
          {!loading && ideas.length > 0 && <ComparisonView ideas={ideas} />}
          {!loading && ideas.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, maxWidth: 680, margin: '0 auto 20px' }}>
              <PillButton variant="ghost" onClick={handleShare}>分享这些创意</PillButton>
            </div>
          )}
          {!loading && ideas.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} user={user} favorites={favorites} onFavChange={toggleFavorite} onKeywordClick={handleKeywordClick} />)}
            </div>
          )}
          {!loading && ideas.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: `1px solid ${T.borderLight}` }}>
              <p style={{ fontSize: 13, color: T.textSec, marginBottom: 12 }}>换个方向继续探索</p>
              <PillButton variant="outline" onClick={handleRandom}>随机生成</PillButton>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 个人收藏页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'profile' && (
        <div style={{ ...containerStyle, paddingTop: 40, paddingBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: T.text, letterSpacing: '-0.5px' }}>我的收藏</h2>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {['全部', '工具型', '内容型', '平台型', '服务型'].map((tab) => (
              <PillButton
                key={tab}
                variant={filterType === tab ? 'primary' : 'default'}
                onClick={() => setFilterType(tab)}
              >
                {tab}
              </PillButton>
            ))}
          </div>
          {filteredFavorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>💡</div>
              <p style={{ color: T.textSec, fontSize: 15, marginBottom: 16 }}>还没有收藏，去生成一些创意吧</p>
              <PillButton variant="outline" onClick={() => setView('home')}>去发现创意 →</PillButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFavorites.map((idea, i) => (
                <IdeaCard key={i} idea={{
                  ...idea,
                  whyItMatters: idea.why_it_matters || idea.whyItMatters,
                  targetUser: idea.target_user || idea.targetUser,
                  painPoint: idea.pain_point || idea.painPoint,
                  mvpPlan: idea.mvp_plan || idea.mvpPlan,
                  builderTake: idea.builder_take || idea.builderTake,
                  riskWarning: idea.risk_warning || idea.riskWarning,
                  competitorLandscape: idea.competitor_landscape || idea.competitorLandscape,
                  ideaType: idea.idea_type || idea.ideaType,
                  revenueModel: idea.revenue_model || idea.revenueModel,
                  devTime: idea.dev_time || idea.devTime,
                  relatedKeywords: idea.related_keywords || idea.relatedKeywords,
                }} user={user} favorites={favorites} onFavChange={toggleFavorite} onKeywordClick={handleKeywordClick} compact />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 搜索历史页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'history' && (
        <div style={{ ...containerStyle, paddingTop: 40, paddingBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 24px', color: T.text, letterSpacing: '-0.5px' }}>搜索历史</h2>
          {searches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
              <p style={{ color: T.textSec, fontSize: 15, marginBottom: 16 }}>还没有搜索记录</p>
              <PillButton variant="outline" onClick={() => setView('home')}>去发现创意 →</PillButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {groupSearchesByDate(searches).map(([group, items]) => (
                <div key={group}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.textTert, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>{group}</p>
                  <div style={{
                    background: T.bgCard, borderRadius: T.rMd,
                    border: `1px solid ${T.borderLight}`, overflow: 'hidden',
                    boxShadow: T.shadow1,
                  }}>
                    {items.map((s, i) => (
                      <div key={s.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 20px', cursor: 'pointer',
                        borderBottom: i < items.length - 1 ? `1px solid ${T.borderLight}` : 'none',
                        transition: `background ${T.dur} ${T.ease}`,
                      }} onClick={() => handleGenerate(s.keywords)}
                        onMouseEnter={(e) => e.currentTarget.style.background = T.bgSubtle}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 14, color: T.textTert }}>·</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.keywords}</span>
                          <span style={{ fontSize: 12, color: T.textTert }}>{formatTime(s.created_at)} · 生成了 5 个创意</span>
                        </div>
                        <PillButton variant="ghost" onClick={(e) => { e.stopPropagation(); handleGenerate(s.keywords); }} style={{ fontSize: 12, padding: '4px 12px' }}>
                          重新生成 →
                        </PillButton>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 页脚 ─────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '32px 0',
        borderTop: `1px solid ${T.borderLight}`,
        color: T.textTert, fontSize: 12,
      }}>
        <p style={{ margin: 0 }}>Builder Brain · 为独立开发者和 AI Builder 设计的产品灵感工具</p>
      </footer>
    </div>
  );
}

function NavButton({ children, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: T.font,
      color: active ? T.accent : T.textSec, background: 'none', border: 'none',
      padding: '8px 14px', cursor: 'pointer', borderRadius: T.rSm,
      transition: `all ${T.dur} ${T.ease}`,
      ...(active ? { background: T.accentSoft } : {}),
    }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.bgSubtle; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
