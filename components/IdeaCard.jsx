import { useState } from 'react';
import { supabase } from '../lib/supabase';

// ═══════════════════════════════════════════════════════
// AI SaaS 高级感设计系统（与 index.jsx 保持一致）
// ═══════════════════════════════════════════════════════

const T = {
  bg:         '#F7F8FC',
  bgCard:     '#FFFFFF',
  bgSubtle:   '#F0F1F6',
  text:       '#1A1D2E',
  textSec:    '#6B7194',
  textTert:   '#9CA3C4',
  accent:     '#6366F1',
  accentSoft: '#EEF0FF',
  accentHover:'#4F46E5',
  green:      '#10B981',
  greenSoft:  '#ECFDF5',
  amber:      '#F59E0B',
  amberSoft:  '#FFFBEB',
  rose:       '#F43F5E',
  roseSoft:   '#FFF1F3',
  blue:       '#3B82F6',
  blueSoft:   '#EFF6FF',
  border:     '#E5E7F0',
  borderLight:'#F0F1F6',
  shadow1:    '0 1px 3px rgba(26,29,46,0.04), 0 1px 2px rgba(26,29,46,0.03)',
  shadow2:    '0 4px 12px rgba(26,29,46,0.06), 0 2px 4px rgba(26,29,46,0.04)',
  rSm:  8,
  rMd:  16,
  rLg:  20,
  rFull:'9999px',
  font: "'Urbanist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  dur:  '200ms',
  durSlow: '300ms',
};

const difficultyConfig = {
  easy: { bg: T.greenSoft, text: T.green, label: '简单' },
  medium: { bg: T.amberSoft, text: T.amber, label: '中等' },
  hard: { bg: T.roseSoft, text: T.rose, label: '困难' },
};

const ideaTypeConfig = {
  '工具型': { bg: T.blueSoft, text: T.blue },
  '内容型': { bg: '#F5F3FF', text: '#7C3AED' },
  '平台型': { bg: T.greenSoft, text: T.green },
  '服务型': { bg: T.amberSoft, text: '#C2410C' },
};

const revenueConfig = {
  '订阅制': { bg: '#F5F3FF', text: '#7C3AED' },
  '一次性付费': { bg: T.blueSoft, text: T.blue },
  '广告变现': { bg: T.amberSoft, text: T.amber },
  '佣金抽成': { bg: T.greenSoft, text: T.green },
  '免费增值': { bg: T.roseSoft, text: T.rose },
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
        color: T.textTert,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        fontFamily: T.font,
      }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(to right, ${T.border}, transparent)`,
      }} />
    </div>
  );
}

export default function IdeaCard({ idea, user, favorites, onFavChange, onKeywordClick, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const isFavorited = favorites.some((f) => f.title === idea.title);

  // 点赞 — 本地状态，无需登录
  function handleLike(e) {
    e.stopPropagation();
    setLiked(!liked);
  }

  // 收藏 — 需登录，Supabase 持久化
  async function handleFavorite(e) {
    e.stopPropagation();
    if (!user) {
      // 未登录 → 跳转 Google 登录，登录后回到当前页
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      return;
    }
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

  // 点赞 / 收藏按钮组（复用组件）
  function ActionButtons() {
    const btnBase = {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 13, fontFamily: T.font, fontWeight: 500,
      padding: '4px 8px', borderRadius: T.rSm,
      transition: `all ${T.dur} ${T.ease}`,
    };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* 点赞 */}
        <button onClick={handleLike} style={{
          ...btnBase,
          color: liked ? T.accent : T.textTert,
        }} onMouseEnter={(e) => { e.currentTarget.style.background = T.accentSoft; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
           title="点赞">
          {liked ? '👍' : '👍'}
        </button>
        {/* 收藏 */}
        <button onClick={handleFavorite} style={{
          ...btnBase,
          color: isFavorited ? T.text : T.textTert,
        }} onMouseEnter={(e) => { e.currentTarget.style.background = T.accentSoft; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
           title={user ? (isFavorited ? '取消收藏' : '收藏') : '登录后收藏'}>
          {isFavorited ? '★' : '☆'}
        </button>
      </div>
    );
  }

  // 紧凑模式（收藏页用）
  if (compact) {
    return (
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: T.bgCard,
          borderRadius: T.rMd,
          padding: '20px 24px',
          cursor: 'pointer',
          border: `1px solid ${T.borderLight}`,
          boxShadow: T.shadow1,
          transition: `all ${T.dur} ${T.ease}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = T.shadow2;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = T.shadow1;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: T.text, fontFamily: T.font }}>{idea.title}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: T.rFull, background: diff.bg, color: diff.text }}>
              {diff.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: T.rFull, background: revStyle.bg, color: revStyle.text }}>
              {idea.revenueModel || idea.monetization}
            </span>
          </div>
          <ActionButtons />
        </div>
        <p style={{ color: T.textSec, fontSize: 14, lineHeight: 1.6, margin: 0, fontFamily: T.font }}>
          {idea.whyItMatters || idea.description}
        </p>
        <p style={{ color: T.textTert, fontSize: 12, margin: '8px 0 0', fontFamily: T.font }}>
          {expanded ? '收起详情 ↑' : '展开详情 ↓'}
        </p>

        {expanded && (
          <div style={{ marginTop: 16, borderTop: `1px solid ${T.borderLight}`, paddingTop: 16 }}>
            {idea.description && idea.description !== idea.whyItMatters && (
              <p style={{ color: T.textSec, fontSize: 14, lineHeight: 1.8, marginBottom: 12, fontFamily: T.font }}>{idea.description}</p>
            )}
            {idea.targetUser && (
              <p style={{ color: T.textSec, fontSize: 13, lineHeight: 1.6, marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontWeight: 600, color: T.text }}>目标用户：</span>{idea.targetUser}
              </p>
            )}
            {idea.painPoint && (
              <p style={{ color: T.textSec, fontSize: 13, lineHeight: 1.6, marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontWeight: 600, color: T.text }}>核心痛点：</span>{idea.painPoint}
              </p>
            )}
            {idea.mvpPlan && (
              <p style={{ color: T.textSec, fontSize: 13, lineHeight: 1.6, marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontWeight: 600, color: T.text }}>MVP 做法：</span>{idea.mvpPlan}
              </p>
            )}
            {idea.builderTake && (
              <p style={{ color: T.accent, fontSize: 13, lineHeight: 1.6, marginBottom: 6, fontFamily: T.font }}>
                <span style={{ fontWeight: 600 }}>Builder 判断：</span>{idea.builderTake}
              </p>
            )}
            {idea.riskWarning && (
              <div style={{ background: T.roseSoft, borderRadius: T.rSm, padding: '10px 14px', marginTop: 10, border: `1px solid rgba(244,63,94,0.1)` }}>
                <p style={{ color: T.rose, fontSize: 13, margin: 0, lineHeight: 1.6, fontFamily: T.font }}>
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
                      fontSize: 12, padding: '4px 12px', borderRadius: T.rFull,
                      background: T.bgSubtle, color: T.textSec, border: `1px solid ${T.borderLight}`,
                      cursor: 'pointer', fontFamily: T.font,
                      transition: `all ${T.dur} ${T.ease}`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = T.accent;
                      e.target.style.color = T.accent;
                      e.target.style.background = T.accentSoft;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = T.borderLight;
                      e.target.style.color = T.textSec;
                      e.target.style.background = T.bgSubtle;
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
      background: T.bgCard,
      borderRadius: T.rMd,
      padding: '28px 32px',
      border: `1px solid ${T.borderLight}`,
      maxWidth: 680,
      margin: '0 auto',
      boxShadow: T.shadow1,
      transition: `all ${T.dur} ${T.ease}`,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = T.shadow2;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = T.shadow1;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 标签行 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: T.rFull, background: diff.bg, color: diff.text, fontFamily: T.font }}>
          {diff.label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: T.rFull, background: revStyle.bg, color: revStyle.text, fontFamily: T.font }}>
          {idea.revenueModel || idea.monetization}
        </span>
        {idea.devTime && (
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: T.rFull, background: T.bgSubtle, color: T.textSec, fontFamily: T.font }}>
            {idea.devTime}
          </span>
        )}
        {idea.ideaType && (
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: T.rFull, background: typeStyle.bg, color: typeStyle.text, fontFamily: T.font }}>
            {idea.ideaType}
          </span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <ActionButtons />
        </div>
      </div>

      {/* 标题 */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: '0 0 4px', lineHeight: 1.3, fontFamily: T.font, letterSpacing: '-0.3px' }}>
        {idea.title}
      </h3>

      {/* THE SIGNAL */}
      {idea.whyItMatters && (
        <>
          <SectionDivider label="THE SIGNAL" />
          <p style={{ fontSize: 15, color: T.text, fontWeight: 600, lineHeight: 1.8, margin: 0, fontFamily: T.font }}>
            {idea.whyItMatters}
          </p>
        </>
      )}

      {/* THE CONTEXT */}
      {(idea.description || idea.targetUser || idea.painPoint) && (
        <>
          <SectionDivider label="THE CONTEXT" />
          {idea.description && (
            <p style={{ fontSize: 15, color: T.textSec, lineHeight: 1.8, margin: '0 0 12px', fontFamily: T.font }}>
              {idea.description}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {idea.targetUser && (
              <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, margin: 0, fontFamily: T.font }}>
                <span style={{ color: T.textTert }}>· </span>目标用户：{idea.targetUser}
              </p>
            )}
            {idea.painPoint && (
              <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, margin: 0, fontFamily: T.font }}>
                <span style={{ color: T.textTert }}>· </span>核心痛点：{idea.painPoint}
              </p>
            )}
          </div>
        </>
      )}

      {/* THE VIEW */}
      {(idea.builderTake || idea.riskWarning || idea.competitorLandscape) && (
        <>
          <SectionDivider label="THE VIEW" />
          {idea.builderTake && (
            <p style={{ fontSize: 14, color: T.accent, lineHeight: 1.7, margin: '0 0 10px', fontWeight: 500, fontFamily: T.font }}>
              Builder 判断：{idea.builderTake}
            </p>
          )}
          {idea.riskWarning && (
            <div style={{
              background: T.roseSoft,
              borderRadius: T.rSm,
              padding: '10px 14px',
              marginBottom: idea.competitorLandscape ? 10 : 0,
              border: `1px solid rgba(244,63,94,0.1)`,
            }}>
              <p style={{ color: T.rose, fontSize: 13, margin: 0, lineHeight: 1.6, fontFamily: T.font }}>
                ⚠ 风险：{idea.riskWarning}
              </p>
            </div>
          )}
          {idea.competitorLandscape && (
            <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, margin: 0, fontFamily: T.font }}>
              竞争格局：{idea.competitorLandscape}
            </p>
          )}
        </>
      )}

      {/* THE PLAN */}
      {(idea.mvpPlan || idea.monetization || idea.devTime) && (
        <>
          <SectionDivider label="THE PLAN" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {idea.mvpPlan && (
              <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, margin: 0, fontFamily: T.font }}>
                <span style={{ color: T.textTert }}>· </span>MVP 做法：{idea.mvpPlan}
              </p>
            )}
            {idea.monetization && (
              <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.7, margin: 0, fontFamily: T.font }}>
                <span style={{ color: T.textTert }}>· </span>变现方式：{idea.monetization}
              </p>
            )}
          </div>
        </>
      )}

      {/* 延伸探索 */}
      {idea.relatedKeywords && idea.relatedKeywords.length > 0 && onKeywordClick && (
        <>
          <SectionDivider label="延伸探索" />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {idea.relatedKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => onKeywordClick(kw)}
                style={{
                  fontSize: 12, padding: '5px 14px', borderRadius: T.rFull,
                  background: T.bgSubtle, color: T.textSec, border: `1px solid ${T.borderLight}`,
                  cursor: 'pointer', fontFamily: T.font,
                  transition: `all ${T.dur} ${T.ease}`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = T.accent;
                  e.target.style.color = T.accent;
                  e.target.style.background = T.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = T.borderLight;
                  e.target.style.color = T.textSec;
                  e.target.style.background = T.bgSubtle;
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 底部 CTA */}
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: `1px solid ${T.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontSize: 14, fontWeight: 600, color: T.accent,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, fontFamily: T.font,
            transition: `opacity ${T.dur} ${T.ease}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          {expanded ? '收起详情 ↑' : '查看执行计划 →'}
        </button>
        {idea.devTime && (
          <span style={{ fontSize: 12, color: T.textTert, fontFamily: T.font }}>
            预计 {idea.devTime}
          </span>
        )}
      </div>

      {/* 展开详情 */}
      {expanded && (
        <div style={{
          marginTop: 16,
          padding: '16px 20px',
          background: T.bgSubtle,
          borderRadius: T.rSm,
          fontSize: 14,
          lineHeight: 1.8,
          color: T.textSec,
          fontFamily: T.font,
        }}>
          {idea.builderTake && <p style={{ margin: '0 0 8px' }}><strong style={{ color: T.accent }}>Builder 判断：</strong>{idea.builderTake}</p>}
          {idea.riskWarning && <p style={{ margin: '0 0 8px' }}><strong style={{ color: T.rose }}>风险提示：</strong>{idea.riskWarning}</p>}
          {idea.competitorLandscape && <p style={{ margin: '0 0 8px' }}><strong style={{ color: T.text }}>竞争格局：</strong>{idea.competitorLandscape}</p>}
          {idea.mvpPlan && <p style={{ margin: '0 0 8px' }}><strong style={{ color: T.text }}>MVP 做法：</strong>{idea.mvpPlan}</p>}
          {idea.monetization && <p style={{ margin: 0 }}><strong style={{ color: T.text }}>变现方式：</strong>{idea.monetization}</p>}
        </div>
      )}
    </div>
  );
}
