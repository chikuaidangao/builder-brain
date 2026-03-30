import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import IdeaCard from '../components/IdeaCard';

function btnStyle(bg, color, extra = {}) {
  return { padding: '10px 20px', fontSize: 14, fontWeight: 600, background: bg, color, border: 'none', borderRadius: 8, cursor: 'pointer', ...extra };
}

const QUICK_DIRECTIONS = ['AI副业', '小红书', '电商', '设计工具', '自动化', '效率工具'];

const TRENDS = [
  { category: '内容创作', items: ['小红书封面', 'AI短视频', '自动剪辑', '爆款标题'] },
  { category: '副业赚钱', items: ['AI变现工具', '自动接单', '数字产品', '订阅制工具'] },
  { category: '电商', items: ['商品图生成', '评论分析', '选品工具', '广告素材生成'] },
  { category: '效率工具', items: ['自动日报', '邮件总结', '会议纪要', '任务拆解'] },
];

const RANDOM_KEYWORDS = ['AI + 副业 + 自动化', '小红书 + 电商 + 选品', '设计工具 + SaaS', '效率工具 + 订阅', 'AI + 内容创作', '电商 + AI + 广告'];

const FEATURED = [
  { label: '本周值得关注', color: '#f0f0ff', border: '#534AB7', text: '#534AB7', items: ['AI Agent工具', '知识付费', '出海工具'] },
  { label: '适合新手', color: '#e6f4ea', border: '#2d6a4f', text: '#2d6a4f', items: ['小红书运营工具', '简历优化', '自动日报'] },
  { label: '更容易变现', color: '#fff8e1', border: '#b45309', text: '#b45309', items: ['订阅制工具', 'AI变现工具', '数字产品'] },
];

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
    const { data } = await supabase.from('searches').select('*').order('created_at', { ascending: false }).limit(20);
    setSearches(data || []);
  }

  async function handleGenerate(kw) {
    const query = kw || keywords;
    if (!query.trim()) return;
    setKeywords(query);
    setLoading(true); setError(''); setIdeas([]); setSummary(''); setView('home');
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

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif' }}>

      {/* 顶部导航 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, cursor: 'pointer' }} onClick={() => setView('home')}>Builder Brain</h1>
          <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>为 AI Builder 和独立开发者设计的产品灵感工具</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {user ? (
            <>
              <button onClick={() => setView('profile')} style={btnStyle('#f5f5f5', '#333')}>我的收藏</button>
              <button onClick={() => setView('history')} style={btnStyle('#f5f5f5', '#333')}>搜索历史</button>
              <button onClick={() => { supabase.auth.signOut(); setFavorites([]); setSearches([]); setView('home'); }} style={btnStyle('#f5f5f5', '#333')}>退出</button>
            </>
          ) : (
            <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={btnStyle('#1a1a1a', '#fff')}>Google 登录</button>
          )}
        </div>
      </div>

      {view === 'home' && (
        <>
          {/* Hero 区 */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.5px' }}>
              从趋势中发现<br />值得开发的产品 idea
            </h2>
            <p style={{ color: '#888', fontSize: 15, margin: 0 }}>
              输入你感兴趣的方向，AI 帮你拆解成可落地的产品机会
            </p>
          </div>

          {/* 搜索区 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <input
                type='text'
                placeholder='例如：AI + 小红书 + 电商'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                style={{ flex: 1, padding: '14px 18px', fontSize: 16, border: '1px solid #ddd', borderRadius: 10, outline: 'none' }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !keywords.trim()}
                style={btnStyle(loading ? '#ccc' : '#1a1a1a', '#fff', { padding: '14px 28px', fontSize: 15, borderRadius: 10 })}
              >
                {loading ? '生成中...' : '生成创意'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#aaa', margin: 0, textAlign: 'center' }}>支持多个关键词组合，用 + 分隔效果更好</p>
          </div>

          {/* 快速方向 */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, color: '#bbb', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>快速方向</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleGenerate(d)}
                  style={btnStyle('#f5f5f5', '#333', { fontSize: 13, padding: '7px 16px', borderRadius: 20 })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 今日推荐 */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, color: '#bbb', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>今日推荐</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {FEATURED.map((f) => (
                <div key={f.label} style={{ background: f.color, borderRadius: 12, padding: 16, borderLeft: `3px solid ${f.border}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: f.text, margin: '0 0 12px' }}>{f.label}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {f.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleGenerate(item)}
                        style={{ background: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#333', cursor: 'pointer', textAlign: 'left' }}
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
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, color: '#bbb', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>热门趋势</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TRENDS.map((t) => (
                <div key={t.category} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#333', margin: '0 0 10px' }}>{t.category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {t.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleGenerate(item)}
                        style={{ background: '#f5f5f5', border: 'none', borderRadius: 16, padding: '5px 12px', fontSize: 12, color: '#555', cursor: 'pointer' }}
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
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <button
              onClick={handleRandom}
              style={btnStyle('#f0f0ff', '#534AB7', { fontSize: 15, padding: '14px 36px', borderRadius: 28 })}
            >
              ✨ 随机生成创业机会
            </button>
            <p style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>不知道从哪里开始？让我们帮你随机挑一个方向</p>
          </div>
        </>
      )}

      {view === 'profile' && <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>我的收藏 ({favorites.length})</h2>}

      {view === 'history' && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>搜索历史</h2>
          {searches.length === 0 && <p style={{ color: '#999' }}>还没有搜索记录</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {searches.map((s) => (
              <button
                key={s.id}
                onClick={() => handleGenerate(s.keywords)}
                style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 14 }}
              >
                {s.keywords}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: '#9b2226', background: '#fdecea', padding: '12px 16px', borderRadius: 8, marginBottom: 24 }}>{error}</p>}

      {ideas.length > 0 && view === 'home' && (
        <>
          {summary && (
            <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px 18px', marginBottom: 20, borderLeft: '3px solid #534AB7' }}>
              <p style={{ fontSize: 14, color: '#444', margin: 0, lineHeight: 1.6 }}>{summary}</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={handleShare} style={btnStyle('#f5f5f5', '#333')}>分享这些创意</button>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} user={user} favorites={favorites} onFavChange={toggleFavorite} />
            ))}
          </div>
        </>
      )}

      {view === 'profile' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {favorites.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: 60 }}>还没有收藏，去生成一些创意吧</p>
          ) : (
            favorites.map((idea, i) => (
              <IdeaCard key={i} idea={idea} user={user} favorites={favorites} onFavChange={toggleFavorite} />
            ))
          )}
        </div>
      )}
    </div>
  );
}