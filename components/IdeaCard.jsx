import { useState } from 'react';
import { supabase } from '../lib/supabase';

const difficultyConfig = {
  easy: { bg: '#e6f4ea', text: '#2d6a4f', label: '简单' },
  medium: { bg: '#fff8e1', text: '#b45309', label: '中等' },
  hard: { bg: '#fdecea', text: '#9b2226', label: '困难' },
};

const ideaTypeConfig = {
  '工具型': { bg: '#e8f4fd', text: '#1a6fb5' },
  '内容型': { bg: '#f3e8fd', text: '#7c3aed' },
  '平台型': { bg: '#e8fdf0', text: '#16a34a' },
  '服务型': { bg: '#fef3e8', text: '#c2410c' },
};

const revenueConfig = {
  '订阅制': { bg: '#f0e8ff', text: '#6d28d9' },
  '一次性付费': { bg: '#e8f4fd', text: '#1a6fb5' },
  '广告变现': { bg: '#fff8e1', text: '#b45309' },
  '佣金抽成': { bg: '#e8fdf0', text: '#16a34a' },
  '免费增值': { bg: '#fdecea', text: '#9b2226' },
};

function SectionDivider({ label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0 14px',
      gap: 12,
    }}>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#999',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(to right, #e0e0e0, transparent)',
      }} />
    </div>
  );
}

export default function IdeaCard({ idea, user, favorites, onFavChange, onKeywordClick, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const isFavorited = favorites.some((f) => f.title === idea.title);

  async function toggleFavorite(e) {
    if (e) e.stopPropagation();
    if (!user) { alert('请先登录才能收藏'); return; }
    if (isFavorited) {
      const target = favorites.find((f) => f.title === idea.title);
      if (target) await supabase.from('favorites').delete().eq('id', target.id);
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        title: idea.title,
        description: idea.description,
        difficulty: idea.difficulty,
        monetization: idea.monetization,
        why_it_matters: idea.whyItMatters,
        target_user: idea.targetUser,
        pain_point: idea.painPoint,
        mvp_plan: idea.mvpPlan,
        builder_take: idea.builderTake,
        risk_warning: idea.riskWarning,
        competitor_landscape: idea.competitorLandscape,
        idea_type: idea.ideaType,
        revenue_model: idea.revenueModel,
        dev_time: idea.devTime,
        related_keywords: idea.relatedKeywords,
      });
    }
    onFavChange();
  }

  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.medium;
  const typeStyle = ideaTypeConfig[idea.ideaType] || ideaTypeConfig['工具型'];
  const revStyle = revenueConfig[idea.revenueModel] || revenueConfig['订阅制'];

  // 紧凑模式（收藏页用）
  if (compact) {
    return (
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          cursor: 'pointer',
          border: '1px solid #e8e4de',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{idea.title}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: diff.bg, color: diff.text }}>
              {diff.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: revStyle.bg, color: revStyle.text }}>
              {idea.revenueModel || idea.monetization}
            </span>
          </div>
          {user && (
            <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
              {isFavorited ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          {idea.whyItMatters || idea.description}
        </p>
        <p style={{ color: '#aaa', fontSize: 12, margin: '8px 0 0' }}>
          {expanded ? '收起详情 ↑' : '展开详情 ↓'}
        </p>

        {expanded && (
          <div style={{ marginTop: 16, borderTop: '1px solid #f0ece6', paddingTop: 16 }}>
            {idea.description && idea.description !== idea.whyItMatters && (
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>{idea.description}</p>
            )}
            {idea.targetUser && (
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>目标用户：</span>{idea.targetUser}
              </p>
            )}
            {idea.painPoint && (
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>核心痛点：</span>{idea.painPoint}
              </p>
            )}
            {idea.mvpPlan && (
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>MVP 做法：</span>{idea.mvpPlan}
              </p>
            )}
            {idea.builderTake && (
              <p style={{ color: '#534AB7', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Builder 判断：</span>{idea.builderTake}
              </p>
            )}
            {idea.riskWarning && (
              <div style={{ background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginTop: 10 }}>
                <p style={{ color: '#9b2226', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600 }}>⚠ 风险：</span>{idea.riskWarning}
                </p>
              </div>
            )}
            {idea.relatedKeywords && idea.relatedKeywords.length > 0 && onKeywordClick && (
              <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {idea.relatedKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); onKeywordClick(kw); }}
                    style={{
                      fontSize: 12, padding: '4px 12px', borderRadius: 16,
                      background: '#f5f0e8', color: '#666', border: 'none', cursor: 'pointer',
                    }}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 完整模式（搜索结果页用）
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '28px 32px',
      border: '1px solid #e8e4de',
      maxWidth: 680,
      margin: '0 auto',
    }}>
      {/* 标签行 — Ground News 风格 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: diff.bg, color: diff.text }}>
          {diff.label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: revStyle.bg, color: revStyle.text }}>
          {idea.revenueModel || idea.monetization}
        </span>
        {idea.devTime && (
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: '#f5f5f5', color: '#666' }}>
            {idea.devTime}
          </span>
        )}
        {idea.ideaType && (
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: typeStyle.bg, color: typeStyle.text }}>
            {idea.ideaType}
          </span>
        )}
        {/* 收藏按钮 */}
        <div style={{ marginLeft: 'auto' }}>
          {user && (
            <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
              {isFavorited ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>

      {/* 标题 — Axios 风格 */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.3 }}>
        {idea.title}
      </h3>

      {/* THE SIGNAL — Semafor 区块 */}
      {idea.whyItMatters && (
        <>
          <SectionDivider label="THE SIGNAL" />
          <p style={{ fontSize: 15, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            {idea.whyItMatters}
          </p>
        </>
      )}

      {/* THE CONTEXT — Semafor + Axios bullet */}
      {(idea.description || idea.targetUser || idea.painPoint) && (
        <>
          <SectionDivider label="THE CONTEXT" />
          {idea.description && (
            <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, margin: '0 0 12px' }}>
              {idea.description}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {idea.targetUser && (
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
                <span style={{ color: '#999' }}>· </span>目标用户：{idea.targetUser}
              </p>
            )}
            {idea.painPoint && (
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
                <span style={{ color: '#999' }}>· </span>核心痛点：{idea.painPoint}
              </p>
            )}
          </div>
        </>
      )}

      {/* THE VIEW — Semafor 区块 */}
      {(idea.builderTake || idea.riskWarning || idea.competitorLandscape) && (
        <>
          <SectionDivider label="THE VIEW" />
          {idea.builderTake && (
            <p style={{ fontSize: 14, color: '#534AB7', lineHeight: 1.7, margin: '0 0 10px', fontWeight: 500 }}>
              Builder 判断：{idea.builderTake}
            </p>
          )}
          {idea.riskWarning && (
            <div style={{
              background: '#fef2f2',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: idea.competitorLandscape ? 10 : 0,
            }}>
              <p style={{ color: '#9b2226', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                ⚠ 风险：{idea.riskWarning}
              </p>
            </div>
          )}
          {idea.competitorLandscape && (
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0 }}>
              竞争格局：{idea.competitorLandscape}
            </p>
          )}
        </>
      )}

      {/* THE PLAN — Semafor 区块 */}
      {(idea.mvpPlan || idea.monetization || idea.devTime) && (
        <>
          <SectionDivider label="THE PLAN" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {idea.mvpPlan && (
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
                <span style={{ color: '#999' }}>· </span>MVP 做法：{idea.mvpPlan}
              </p>
            )}
            {idea.monetization && (
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
                <span style={{ color: '#999' }}>· </span>变现方式：{idea.monetization}
              </p>
            )}
          </div>
        </>
      )}

      {/* 延伸探索 — Quanta 风格 */}
      {idea.relatedKeywords && idea.relatedKeywords.length > 0 && onKeywordClick && (
        <>
          <SectionDivider label="延伸探索" />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {idea.relatedKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => onKeywordClick(kw)}
                style={{
                  fontSize: 12, padding: '5px 14px', borderRadius: 16,
                  background: '#f5f0e8', color: '#666', border: '1px solid #e8e4de',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#ede7db'}
                onMouseLeave={(e) => e.target.style.background = '#f5f0e8'}
              >
                {kw}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 底部 CTA — Axios Go deeper 风格 */}
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid #f0ece6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontSize: 14, fontWeight: 600, color: '#534AB7',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? '收起详情 ↑' : '查看执行计划 →'}
        </button>
        {idea.devTime && (
          <span style={{ fontSize: 12, color: '#aaa' }}>
            预计 {idea.devTime}
          </span>
        )}
      </div>

      {/* 展开详情（移动端友好） */}
      {expanded && (
        <div style={{
          marginTop: 16,
          padding: '16px 20px',
          background: '#faf8f3',
          borderRadius: 10,
          fontSize: 14,
          lineHeight: 1.8,
          color: '#555',
        }}>
          {idea.builderTake && <p style={{ margin: '0 0 8px' }}><strong>Builder 判断：</strong>{idea.builderTake}</p>}
          {idea.riskWarning && <p style={{ margin: '0 0 8px' }}><strong>风险提示：</strong>{idea.riskWarning}</p>}
          {idea.competitorLandscape && <p style={{ margin: '0 0 8px' }}><strong>竞争格局：</strong>{idea.competitorLandscape}</p>}
          {idea.mvpPlan && <p style={{ margin: '0 0 8px' }}><strong>MVP 做法：</strong>{idea.mvpPlan}</p>}
          {idea.monetization && <p style={{ margin: 0 }}><strong>变现方式：</strong>{idea.monetization}</p>}
        </div>
      )}
    </div>
  );
}
