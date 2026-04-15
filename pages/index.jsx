import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import IdeaCard from '../components/IdeaCard';

// ─── 数据 ───────────────────────────────────────────
const QUICK_DIRECTIONS = ['AI副业', '小红书', '电商', '设计工具', '自动化', '效率工具'];

const TRENDS = [
  { category: '内容创作', items: ['小红书封面', 'AI短视频', '自动剪辑', '爆款标题'] },
  { category: '副业赚钱', items: ['AI变现工具', '自动接单', '数字产品', '订阅制工具'] },
  { category: '电商', items: ['商品图生成', '评论分析', '选品工具', '广告素材生成'] },
  { category: '效率工具', items: ['自动日报', '邮件总结', '会议纪要', '任务拆解'] },
];

const FEATURED = [
  { label: '本周值得关注', color: '#f0ece6', border: '#534AB7', text: '#534AB7', items: ['AI Agent工具', '知识付费', '出海工具'] },
  { label: '适合新手', color: '#e6f4ea', border: '#2d6a4f', text: '#2d6a4f', items: ['小红书运营工具', '简历优化', '自动日报'] },
  { label: '更容易变现', color: '#fff8e1', border: '#b45309', text: '#b45309', items: ['订阅制工具', 'AI变现工具', '数字产品'] },
];

const RANDOM_KEYWORDS = ['AI + 副业 + 自动化', '小红书 + 电商 + 选品', '设计工具 + SaaS', '效率工具 + 订阅', 'AI + 内容创作', '电商 + AI + 广告'];

// ─── 对比视图组件 ────────────────────────────────────
function ComparisonView({ ideas }) {
  const difficultyMap = { easy: { label: '简单', width: 30, color: '#2d6a4f', bg: '#e6f4ea' }, medium: { label: '中等', width: 55, color: '#b45309', bg: '#fff8e1' }, hard: { label: '困难', width: 80, color: '#9b2226', bg: '#fdecea' } };
  const monetMap = { '高': { width: 80, color: '#534AB7' }, '中': { width: 55, color: '#534AB7' }, '低': { width: 30, color: '#534AB7' } };

  function getMonetLevel(idea) {
    const m = (idea.monetization || '').toLowerCase();
    if (m.includes('订阅') || m.includes('高') || m.includes('强')) return '高';
    if (m.includes('广告') || m.includes('中')) return '中';
    return '低';
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '24px 28px',
      border: '1px solid #e8e4de', marginBottom: 32, maxWidth: 680, margin: '0 auto 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>对比视图</h3>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#999' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#e6f4ea', marginRight: 4, verticalAlign: 'middle' }} />开发难度</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f0e8ff', marginRight: 4, verticalAlign: 'middle' }} />变现潜力</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ideas.map((idea, i) => {
          const diff = difficultyMap[idea.difficulty] || difficultyMap.medium;
          const monLevel = getMonetLevel(idea);
          const mon = monetMap[monLevel] || monetMap['中'];
          return (
            <div key={i}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#333', margin: '0 0 6px' }}>{idea.title}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${diff.width}%`, background: diff.bg, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 10, color: diff.color, fontWeight: 600 }}>{diff.label}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${mon.width}%`, background: '#f0e8ff', borderRadius: 4, transition: 'width 0.5s' }} />
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
  const [view, setView] = useState('home'); // home | results | profile | history
  const [filterType, setFilterType] = useState('全部');
  const [generatedCount] = useState(128); // 静态占位数据

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) { fetchFavorites(); fetchSearches(); }
  }, [user]);

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
    setLoading(true); setError(''); setIdeas([]); setSummary(''); setView('results');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '请求失败');
      setIdeas(data.ideas || []);
      setSummary(data.summary || '');
      if (user) {
        await supabase.from('searches').insert({ user_id: user.id, keywords: query });
        fetchSearches();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRandom() {
    const kw = RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)];
    handleGenerate(kw);
  }

  function handleShare() {
    const url = `${window.location.origin}?keywords=${encodeURIComponent(keywords)}`;
    navigator.clipboard.writeText(url);
    alert('链接已复制，分享给朋友吧！');
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kw = params.get('keywords');
    if (kw) handleGenerate(kw);
  }, []);

  async function toggleFavorite() {
    await fetchFavorites();
  }

  function handleKeywordClick(kw) {
    handleGenerate(kw);
  }

  // ─── 通用样式 ──────────────────────────────────────
  const containerStyle = { maxWidth: 680, margin: '0 auto', padding: '0 24px' };
  const sectionTitleStyle = { fontSize: 11, color: '#bbb', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 };

  // ─── 历史记录分组 ──────────────────────────────────
  function groupSearchesByDate(list) {
    const today = new Date(); today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const groups = { '今天': [], '昨天': [], '更早': [] };
    list.forEach(s => {
      const d = new Date(s.created_at);
      if (d >= today) groups['今天'].push(s);
      else if (d >= yesterday) groups['昨天'].push(s);
      else groups['更早'].push(s);
    });
    return Object.entries(groups).filter(([,v]) => v.length > 0);
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  }

  // ─── 收藏页筛选 ────────────────────────────────────
  const filteredFavorites = filterType === '全部'
    ? favorites
    : favorites.filter(f => (f.idea_type || f.ideaType || '工具型') === filterType);

  // ═══════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F3' }}>

      {/* ─── 顶部导航 ─────────────────────────────── */}
      <nav style={{
        background: '#1a1a1a', padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setView('home')}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Noto Serif SC', 'Georgia', serif" }}>Builder Brain</span>
            <span style={{ fontSize: 11, color: '#888', fontFamily: "'Noto Serif SC', 'Georgia', serif" }}>创意副脑</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {user ? (
              <>
                <NavButton onClick={() => setView('home')} active={view === 'home' || view === 'results'}>发现</NavButton>
                <NavButton onClick={() => setView('profile')} active={view === 'profile'}>收藏</NavButton>
                <NavButton onClick={() => setView('history')} active={view === 'history'}>历史</NavButton>
                <NavButton onClick={() => { supabase.auth.signOut(); setFavorites([]); setSearches([]); setView('home'); }}>退出</NavButton>
              </>
            ) : (
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                style={{
                  fontSize: 13, fontWeight: 600, color: '#fff', background: 'none',
                  border: '1px solid #555', borderRadius: 20, padding: '6px 16px', cursor: 'pointer',
                }}
              >
                Google 登录
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ */}
      {/* 首页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'home' && (
        <div style={{ ...containerStyle, paddingTop: 56, paddingBottom: 80 }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{
              fontSize: 38, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.5px',
              lineHeight: 1.2, fontFamily: "'Noto Serif SC', 'Georgia', serif", color: '#1a1a1a',
            }}>
              从趋势中发现<br />值得开发的产品 idea
            </h1>
            <p style={{ color: '#888', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
              输入你感兴趣的方向，AI 帮你拆解成可落地的产品机会
            </p>
          </div>

          {/* 搜索区 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <input
                type='text'
                placeholder='例如：AI + 小红书 + 电商'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                style={{
                  flex: 1, padding: '14px 18px', fontSize: 15,
                  border: '1px solid #e0dcd6', borderRadius: 10, outline: 'none',
                  background: '#fff', color: '#1a1a1a',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#534AB7'}
                onBlur={(e) => e.target.style.borderColor = '#e0dcd6'}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !keywords.trim()}
                style={{
                  padding: '14px 28px', fontSize: 15, fontWeight: 600,
                  background: loading ? '#ccc' : '#1a1a1a', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? '生成中...' : '生成创意'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#bbb', margin: 0, textAlign: 'center' }}>
              支持多个关键词组合，用 + 分隔效果更好
            </p>
          </div>

          {/* 快速方向 */}
          <div style={{ marginBottom: 40 }}>
            <p style={sectionTitleStyle}>快速方向</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleGenerate(d)}
                  style={{
                    fontSize: 13, padding: '7px 16px', borderRadius: 20,
                    background: '#fff', color: '#555', border: '1px solid #e0dcd6',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#fff'; e.target.style.borderColor = '#1a1a1a'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#555'; e.target.style.borderColor = '#e0dcd6'; }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 今日推荐 */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={sectionTitleStyle}>今日推荐</p>
              <span style={{ fontSize: 11, color: '#ccc' }}>今日已生成 {generatedCount} 个创意</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {FEATURED.map((f) => (
                <div key={f.label} style={{ background: f.color, borderRadius: 12, padding: 16, borderLeft: `3px solid ${f.border}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: f.text, margin: '0 0 12px' }}>{f.label}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {f.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleGenerate(item)}
                        style={{
                          background: '#fff', border: 'none', borderRadius: 6,
                          padding: '6px 10px', fontSize: 12, color: '#333',
                          cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = '#fff'}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热门趋势 */}
          <div style={{ marginBottom: 40 }}>
            <p style={sectionTitleStyle}>热门趋势</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TRENDS.map((t) => (
                <div key={t.category} style={{ border: '1px solid #e8e4de', borderRadius: 12, padding: 16, background: '#fff' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: '0 0 10px' }}>{t.category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {t.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleGenerate(item)}
                        style={{
                          background: '#f5f0e8', border: 'none', borderRadius: 16,
                          padding: '5px 12px', fontSize: 12, color: '#555', cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#ede7db'}
                        onMouseLeave={(e) => e.target.style.background = '#f5f0e8'}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 随机生成 */}
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <button
              onClick={handleRandom}
              style={{
                fontSize: 15, fontWeight: 600, padding: '14px 36px', borderRadius: 28,
                background: '#f0ece6', color: '#534AB7', border: '1px solid #e0dcd6',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#534AB7'; e.target.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.target.style.background = '#f0ece6'; e.target.style.color = '#534AB7'; }}
            >
              ✨ 随机生成创业机会
            </button>
            <p style={{ fontSize: 12, color: '#ccc', marginTop: 10 }}>不知道从哪里开始？让我们帮你随机挑一个方向</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 搜索结果页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'results' && (
        <div style={{ ...containerStyle, paddingTop: 40, paddingBottom: 80 }}>
          {/* 返回按钮 */}
          <button
            onClick={() => setView('home')}
            style={{
              fontSize: 13, color: '#888', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ← 返回首页
          </button>

          {/* 关键词 + AI 总结 */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>关键词：</span>
              <span style={{
                fontSize: 15, fontWeight: 700, color: '#1a1a1a',
                fontFamily: "'Noto Serif SC', 'Georgia', serif",
              }}>
                「{keywords}」
              </span>
            </div>
            {summary && (
              <div style={{
                background: '#fff', borderRadius: 10, padding: '14px 20px',
                borderLeft: '3px solid #534AB7', lineHeight: 1.7, color: '#555', fontSize: 14,
              }}>
                {summary}
              </div>
            )}
          </div>

          {error && (
            <div style={{ color: '#9b2226', background: '#fef2f2', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#999', fontSize: 15 }}>正在生成创意，请稍候...</p>
            </div>
          )}

          {/* 对比视图 */}
          {!loading && ideas.length > 0 && <ComparisonView ideas={ideas} />}

          {/* 分享按钮 */}
          {!loading && ideas.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, maxWidth: 680, margin: '0 auto 20px' }}>
              <button
                onClick={handleShare}
                style={{
                  fontSize: 13, fontWeight: 600, color: '#534AB7', background: 'none',
                  border: '1px solid #e0dcd6', borderRadius: 20, padding: '6px 16px', cursor: 'pointer',
                }}
              >
                分享这些创意
              </button>
            </div>
          )}

          {/* Idea 卡片列表 */}
          {!loading && ideas.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {ideas.map((idea, i) => (
                <IdeaCard
                  key={i}
                  idea={idea}
                  user={user}
                  favorites={favorites}
                  onFavChange={toggleFavorite}
                  onKeywordClick={handleKeywordClick}
                />
              ))}
            </div>
          )}

          {/* 延伸探索 */}
          {!loading && ideas.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: '1px solid #e8e4de' }}>
              <p style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>换个方向继续探索</p>
              <button
                onClick={handleRandom}
                style={{
                  fontSize: 14, fontWeight: 600, padding: '10px 24px', borderRadius: 20,
                  background: '#f0ece6', color: '#534AB7', border: '1px solid #e0dcd6',
                  cursor: 'pointer',
                }}
              >
                ✨ 随机生成
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 个人收藏页 */}
      {/* ═══════════════════════════════════════════ */}
      {view === 'profile' && (
        <div style={{ ...containerStyle, paddingTop: 40, paddingBottom: 80 }}>
          <h2 style={{
            fontSize: 24, fontWeight: 700, margin: '0 0 24px',
            fontFamily: "'Noto Serif SC', 'Georgia', serif", color: '#1a1a1a',
          }}>
            我的收藏
          </h2>

          {/* 筛选 Tab */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {['全部', '工具型', '内容型', '平台型', '服务型'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                style={{
                  fontSize: 13, fontWeight: filterType === tab ? 700 : 500,
                  padding: '6px 16px', borderRadius: 20,
                  background: filterType === tab ? '#1a1a1a' : '#fff',
                  color: filterType === tab ? '#fff' : '#666',
                  border: `1px solid ${filterType === tab ? '#1a1a1a' : '#e0dcd6'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredFavorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: '#bbb', fontSize: 15 }}>还没有收藏，去生成一些创意吧</p>
              <button
                onClick={() => setView('home')}
                style={{
                  marginTop: 16, fontSize: 14, fontWeight: 600, color: '#534AB7',
                  background: 'none', border: '1px solid #e0dcd6', borderRadius: 20,
                  padding: '8px 20px', cursor: 'pointer',
                }}
              >
                去发现创意 →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFavorites.map((idea, i) => (
                <IdeaCard
                  key={i}
                  idea={{
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
                  }}
                  user={user}
                  favorites={favorites}
                  onFavChange={toggleFavorite}
                  onKeywordClick={handleKeywordClick}
                  compact
                />
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
          <h2 style={{
            fontSize: 24, fontWeight: 700, margin: '0 0 24px',
            fontFamily: "'Noto Serif SC', 'Georgia', serif", color: '#1a1a1a',
          }}>
            搜索历史
          </h2>

          {searches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: '#bbb', fontSize: 15 }}>还没有搜索记录</p>
              <button
                onClick={() => setView('home')}
                style={{
                  marginTop: 16, fontSize: 14, fontWeight: 600, color: '#534AB7',
                  background: 'none', border: '1px solid #e0dcd6', borderRadius: 20,
                  padding: '8px 20px', cursor: 'pointer',
                }}
              >
                去发现创意 →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {groupSearchesByDate(searches).map(([group, items]) => (
                <div key={group}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#999', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {group}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {items.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 0', borderBottom: '1px solid #f0ece6',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleGenerate(s.keywords)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: '#ccc', fontSize: 14 }}>·</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{s.keywords}</span>
                          <span style={{ fontSize: 12, color: '#bbb' }}>
                            {formatTime(s.created_at)} · 生成了 5 个创意
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGenerate(s.keywords); }}
                          style={{
                            fontSize: 12, fontWeight: 600, color: '#534AB7',
                            background: 'none', border: 'none', cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          重新生成 →
                        </button>
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
        textAlign: 'center', padding: '24px 0', borderTop: '1px solid #e8e4de',
        color: '#ccc', fontSize: 12,
      }}>
        Builder Brain · 为 AI Builder 和独立开发者设计的产品灵感工具
      </footer>
    </div>
  );
}

// ─── 导航按钮组件 ────────────────────────────────────
function NavButton({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? '#fff' : '#999',
        background: 'none', border: 'none',
        padding: '6px 12px', cursor: 'pointer',
        borderBottom: active ? '2px solid #fff' : '2px solid transparent',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}
