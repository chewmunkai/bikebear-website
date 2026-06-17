import React from 'react';
import {
  AbsoluteFill,
  Series,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadHanken} from '@remotion/google-fonts/HankenGrotesk';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const fraunces = loadFraunces('normal', {weights: ['500', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true}).fontFamily;
const hanken = loadHanken('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin'], ignoreTooManyRequestsWarning: true}).fontFamily;
const mono = loadMono('normal', {weights: ['400', '500', '600'], subsets: ['latin'], ignoreTooManyRequestsWarning: true}).fontFamily;

export const FPS = 30;
const APP = 470, PHONE = 150, VALUE = 150, PEOPLE = 120, CLOSE = 120;
export const DEMO_DURATION = APP + PHONE + VALUE + PEOPLE + CLOSE; // 1010 ≈ 33.7s

const C = {
  dusk: '#181410', dusk2: '#211B15',
  paper: '#F6F1E7', paper2: '#EFE6D6', card: '#FFFFFF', cardSoft: '#FBF8F1',
  cream: '#F3ECDE', creamSoft: '#C7BBA7',
  ink: '#211C16', ink2: '#3A332A', inkSoft: '#6E6354',
  green: '#1F6B47', greenD: '#2E8B5E', greenDeep: '#0E3D27', greenBright: '#52C68D',
  honey: '#DC8C36', honeyD: '#F3B85F', clay: '#BC5E36', kill: '#C9512B',
  line: 'rgba(33,28,22,0.12)',
};

/* ---------------- helpers ---------------- */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const useFade = (inDur = 12, outDur = 14, total?: number) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const end = total ?? durationInFrames;
  return Math.min(
    interpolate(frame, [0, inDur], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [end - outDur, end], [1, 0], {extrapolateLeft: 'clamp'})
  );
};
const rise = (frame: number, fps: number, delay = 0, dist = 34) => {
  const s = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7}});
  return {opacity: s, transform: `translateY(${(1 - s) * dist}px)`};
};

const initials = (n: string) => n.split(' ').map((x) => x[0]).slice(0, 2).join('');
const Avatar: React.FC<{name: string; from: string; to: string; size?: number; online?: boolean}> = ({name, from, to, size = 64, online}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <div style={{
      width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg,${from},${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      fontFamily: hanken, fontWeight: 700, fontSize: size * 0.36, border: '3px solid #fff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
    }}>{initials(name)}</div>
    {online && <div style={{position: 'absolute', right: 2, bottom: 2, width: size * 0.22, height: size * 0.22, borderRadius: '50%', background: C.greenBright, border: '2px solid #fff'}} />}
  </div>
);

const LoopMark: React.FC<{size?: number; stroke?: string; dot?: string; rot?: number}> = ({size = 40, stroke = C.green, dot = C.honey, rot = 0}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{transform: `rotate(${rot}deg)`}}>
    <path d="M16 4c-5 0-8 3.2-8 7.4 0 4.6 3.8 6.7 8 8.2 4.2 1.5 8 3.6 8 8.2 0 4.2-3 7.4-8 7.4" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
    <circle cx="16" cy="16" r="2.6" fill={dot} />
  </svg>
);

/* cursor with click ripples */
type Key = {f: number; x: number; y: number; click?: boolean};
const Cursor: React.FC<{keys: Key[]}> = ({keys}) => {
  const frame = useCurrentFrame();
  let x = keys[0].x, y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = easeInOut(interpolate(frame, [a.f, b.f], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; break;
    } else if (frame > b.f) {x = b.x; y = b.y;}
  }
  const press = keys.find((k) => k.click && frame >= k.f && frame < k.f + 5);
  const pressScale = press ? 0.82 : 1;
  return (
    <>
      {keys.filter((k) => k.click).map((k, i) => {
        const p = interpolate(frame, [k.f, k.f + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (p <= 0 || p >= 1) return null;
        return <div key={i} style={{position: 'absolute', left: k.x, top: k.y, width: 10, height: 10, borderRadius: '50%', transform: `translate(-50%,-50%) scale(${1 + p * 6})`, border: `2px solid ${C.green}`, opacity: 1 - p}} />;
      })}
      <div style={{position: 'absolute', left: x, top: y, transform: `scale(${pressScale})`, transformOrigin: 'top left', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))'}}>
        <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 2l14 8.5-6.2 1.4 3.6 6.9-2.7 1.4-3.6-6.9L5 18.5z" fill="#fff" stroke="#181410" strokeWidth={1.4} strokeLinejoin="round" /></svg>
      </div>
    </>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.04, mixBlendMode: 'multiply',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}} />
);

const chip = (label: string, bg: string, fg: string) => (
  <span style={{fontFamily: mono, fontSize: 16, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 8, background: bg, color: fg}}>{label}</span>
);

/* =================================================================== */
/*  APP SECTION — cursor navigates the real Talous app (acts 1–4)       */
/* =================================================================== */
const FX = 200, FY = 120, FW = 1520, FH = 840, SW = 320;
const CXL = FX + SW; // content left = 520
const navY = [FY + 212, FY + 286, FY + 360, FY + 434]; // 332,406,480,554

const NAV = [
  {label: 'Dashboard', icon: 'M4 13h7V4H4zM13 20h7V4h-7zM4 20h7v-5H4z'},
  {label: 'Ad Audit', icon: 'M4 19V5m6 14V9m6 10v-6m4 6V7'},
  {label: 'Approvals', icon: 'm5 12 5 5L20 6'},
  {label: 'Automation', icon: 'M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z'},
];

const Sidebar: React.FC<{active: number}> = ({active}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: FH, background: C.dusk, padding: '28px 22px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
      <LoopMark size={30} stroke={C.greenBright} dot={C.honeyD} />
      <span style={{fontFamily: fraunces, fontWeight: 700, fontSize: 28, color: C.cream}}>talous</span>
    </div>
    <div style={{display: 'flex', background: 'rgba(243,236,222,0.07)', borderRadius: 10, padding: 4, margin: '22px 0', fontFamily: mono, fontSize: 13, color: C.creamSoft}}>
      <div style={{flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 7, background: 'rgba(243,236,222,0.10)', color: C.cream}}>Work</div>
      <div style={{flex: 1, textAlign: 'center', padding: '7px 0', color: C.greenBright}}>Marketing</div>
    </div>
    {NAV.map((n, i) => (
      <div key={n.label} style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: '13px 14px', borderRadius: 11, marginBottom: 6,
        background: active === i ? 'rgba(82,198,141,0.14)' : 'transparent',
        color: active === i ? C.greenBright : C.creamSoft, fontFamily: hanken, fontWeight: 600, fontSize: 18,
      }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
        {n.label}
      </div>
    ))}
  </div>
);

const Tile: React.FC<{k: string; v: string; c?: string}> = ({k, v, c}) => (
  <div style={{flex: 1, background: C.cardSoft, border: `1px solid ${C.line}`, borderRadius: 16, padding: '22px 24px'}}>
    <div style={{fontFamily: mono, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.inkSoft}}>{k}</div>
    <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 44, color: c || C.ink, marginTop: 6}}>{v}</div>
  </div>
);

const AD_ROWS = [
  {n: 'Bestseller — UGC Reel', c: 'Winner', cb: 'rgba(46,139,94,0.14)', cf: C.green, cpc: 'RM2.80', bar: 0.92, col: C.green},
  {n: 'Retargeting — Carousel', c: 'Healthy', cb: 'rgba(33,28,22,0.06)', cf: C.ink2, cpc: 'RM4.10', bar: 0.7, col: C.inkSoft},
  {n: 'New Audience — Image', c: 'Healthy', cb: 'rgba(33,28,22,0.06)', cf: C.ink2, cpc: 'RM5.30', bar: 0.6, col: C.inkSoft},
  {n: 'Clinic Leads — Form', c: 'Warning', cb: 'rgba(220,140,54,0.16)', cf: C.honey, cpc: 'RM9.40', bar: 0.4, col: C.honey},
  {n: 'Raya Promo — Video 3', c: 'Kill', cb: 'rgba(201,81,43,0.16)', cf: C.kill, cpc: 'RM18.90', bar: 0.18, col: C.kill},
];

const ScreenDashboard: React.FC<{f: number; fps: number}> = ({f, fps}) => (
  <div style={{padding: '40px 48px'}}>
    <div style={{...rise(f, fps, 0), fontFamily: mono, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.greenD}}>Marketing · Overview</div>
    <div style={{...rise(f, fps, 4), fontFamily: fraunces, fontWeight: 600, fontSize: 46, color: C.ink, margin: '8px 0 30px'}}>Good morning, Aisyah ☀️</div>
    <div style={{display: 'flex', gap: 18}}>
      <Tile k="7-day spend" v="RM6,020" />
      <Tile k="ROAS" v="2.4×" c={C.green} />
      <Tile k="Ads live" v="146" />
    </div>
  </div>
);

const ScreenAudit: React.FC<{f: number; fps: number}> = ({f, fps}) => {
  const spend = Math.round(interpolate(f, [6, 50], [0, 6020], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const prog = interpolate(f, [4, 70], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{padding: '36px 48px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18}}>
        <div>
          <div style={{...rise(f, fps, 0), fontFamily: mono, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.greenD}}>Ad Audit · Last 7 days</div>
          <div style={{...rise(f, fps, 3), fontFamily: fraunces, fontWeight: 600, fontSize: 40, color: C.ink, marginTop: 6}}>RM{spend.toLocaleString('en-US')} <span style={{fontSize: 22, color: C.inkSoft}}>tracked</span></div>
        </div>
        <div style={{fontFamily: mono, fontSize: 14, color: C.greenD}}>Auditing 146 ads · {Math.round(prog)}%</div>
      </div>
      <div style={{height: 5, background: C.paper2, borderRadius: 4, overflow: 'hidden', marginBottom: 22}}>
        <div style={{height: '100%', width: `${prog}%`, background: C.greenBright}} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
        {AD_ROWS.map((r, i) => {
          const d = 10 + i * 9;
          const s = spring({frame: f - d, fps, config: {damping: 200, mass: 0.6}});
          const isKill = r.c === 'Kill';
          const hl = isKill && f > 120 && f < 210;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -30}px)`,
              display: 'grid', gridTemplateColumns: '54px 1fr 120px 110px 130px', alignItems: 'center', gap: 18,
              background: hl ? '#FFF7F2' : C.card, border: `1px solid ${hl ? 'rgba(201,81,43,0.4)' : C.line}`, borderRadius: 13, padding: '15px 20px',
            }}>
              <div style={{width: 42, height: 42, borderRadius: 9, background: `linear-gradient(135deg,${r.col}22,${r.col}11)`, border: `1px solid ${r.col}33`}} />
              <div style={{fontFamily: hanken, fontWeight: 600, fontSize: 21, color: C.ink}}>{r.n}</div>
              <div>{chip(r.c, r.cb, r.cf)}</div>
              <div style={{fontFamily: mono, fontSize: 18, color: C.inkSoft}}>{r.cpc}</div>
              <div style={{height: 8, background: C.paper2, borderRadius: 5, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${r.bar * 100 * Math.min(1, Math.max(0, (f - d - 4) / 24))}%`, background: r.col, borderRadius: 5}} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ScreenApprovals: React.FC<{f: number; fps: number}> = ({f, fps}) => {
  const conf = Math.round(interpolate(f, [10, 60], [0, 94], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const approved = f > 96; // cursor click lands at approvals-local frame 96
  const out = interpolate(f, [98, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const toast = interpolate(f, [104, 124], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = spring({frame: f - 4, fps, config: {damping: 200, mass: 0.7}});
  return (
    <div style={{padding: '40px 48px', position: 'relative', height: '100%'}}>
      <div style={{fontFamily: mono, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.greenD}}>Approvals · 1 pending</div>
      <div style={{
        opacity: s * (1 - out), transform: `translateY(${(1 - s) * 30 - out * 40}px)`,
        marginTop: 26, background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: '32px 36px', boxShadow: '0 30px 60px -40px rgba(33,28,22,0.4)', maxWidth: 1040,
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{marginBottom: 10}}>{chip('Pause', 'rgba(201,81,43,0.16)', C.kill)}</div>
            <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 38, color: C.ink}}>Pause “Raya Promo — Video 3”</div>
            <div style={{fontFamily: hanken, fontSize: 22, color: C.inkSoft, marginTop: 10, maxWidth: 620}}>Spent RM412 over 6 days with zero sales. It’s a leak — recommend pausing to save the budget.</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontFamily: mono, fontWeight: 600, fontSize: 46, color: C.kill}}>{conf}%</div>
            <div style={{fontFamily: mono, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkSoft}}>Confident</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 30, justifyContent: 'flex-end'}}>
          <div style={{padding: '14px 30px', borderRadius: 100, border: `1.5px solid ${C.line}`, fontFamily: hanken, fontWeight: 600, fontSize: 19, color: C.inkSoft}}>Reject</div>
          <div style={{padding: '14px 34px', borderRadius: 100, background: approved ? C.greenDeep : C.green, color: '#fff', fontFamily: hanken, fontWeight: 600, fontSize: 19, transform: `scale(${f >= 96 && f < 102 ? 0.94 : 1})`}}>{approved ? '✓ Approved' : 'Approve'}</div>
        </div>
      </div>
      {/* toast */}
      <div style={{position: 'absolute', left: 48, bottom: 36, opacity: toast, transform: `translateY(${(1 - toast) * 24}px)`, display: 'flex', alignItems: 'center', gap: 12, background: C.dusk, color: C.cream, padding: '16px 24px', borderRadius: 14, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)'}}>
        <div style={{width: 26, height: 26, borderRadius: '50%', background: C.greenBright, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.dusk, fontWeight: 700}}>✓</div>
        <span style={{fontFamily: hanken, fontWeight: 600, fontSize: 20}}>Paused — saving about <b style={{color: C.honeyD}}>RM412/week</b></span>
      </div>
    </div>
  );
};

const ScreenAutomation: React.FC<{f: number; fps: number}> = ({f, fps}) => {
  const auto = f > 46; // cursor click lands at automation-local frame 46
  const knob = interpolate(f, [46, 72], [82, 88], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = spring({frame: f - 4, fps, config: {damping: 200, mass: 0.7}});
  return (
    <div style={{padding: '40px 48px'}}>
      <div style={{fontFamily: mono, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.greenD}}>Automation · Bestseller brand</div>
      <div style={{opacity: s, transform: `translateY(${(1 - s) * 26}px)`, marginTop: 24, background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: '34px 38px', maxWidth: 980}}>
        <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 32, color: C.ink, marginBottom: 22}}>How much freedom does Talous get?</div>
        <div style={{display: 'flex', background: C.paper2, borderRadius: 100, padding: 6, gap: 6, maxWidth: 520}}>
          <div style={{flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 100, fontFamily: hanken, fontWeight: 600, fontSize: 20, background: auto ? 'transparent' : C.green, color: auto ? C.inkSoft : '#fff'}}>Ask me first</div>
          <div style={{flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 100, fontFamily: hanken, fontWeight: 600, fontSize: 20, background: auto ? C.green : 'transparent', color: auto ? '#fff' : C.inkSoft, transform: `scale(${f >= 46 && f < 52 ? 0.95 : 1})`}}>Full autopilot</div>
        </div>
        <div style={{marginTop: 30, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.inkSoft}}>
          <span>Minimum confidence to act</span><b style={{fontSize: 22, color: C.green}}>{Math.round(knob)}%</b>
        </div>
        <div style={{height: 9, background: C.paper2, borderRadius: 6, marginTop: 12, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${knob}%`, borderRadius: 6, background: `linear-gradient(90deg,${C.honey},${C.green})`}} />
          <div style={{position: 'absolute', top: '50%', left: `${knob}%`, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `3px solid ${C.green}`, transform: 'translate(-50%,-50%)'}} />
        </div>
        <div style={{marginTop: 24, fontFamily: hanken, fontSize: 21, color: auto ? C.green : C.inkSoft, fontWeight: 600}}>
          {auto ? '✓ Talous now runs confident moves on its own — and tells you after.' : 'Talous asks before every change.'}
        </div>
      </div>
    </div>
  );
};

const AppSection: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(14, 16, APP);
  const intro = spring({frame: f, fps, config: {damping: 200, mass: 0.9}});
  // active nav + which screen
  const active = f < 60 ? 0 : f < 204 ? 1 : f < 364 ? 2 : 3;
  const cursor: Key[] = [
    {f: 0, x: 1640, y: 940},
    {f: 16, x: 360, y: navY[0]},
    {f: 58, x: 360, y: navY[1], click: true},
    {f: 120, x: 1280, y: 560},
    {f: 202, x: 360, y: navY[2], click: true},
    {f: 272, x: 1290, y: 735},
    {f: 300, x: 1290, y: 735, click: true},
    {f: 362, x: 360, y: navY[3], click: true},
    {f: 410, x: 1010, y: 388, click: true},
    {f: 470, x: 1010, y: 388},
  ];
  return (
    <AbsoluteFill style={{background: C.paper, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(80% 70% at 50% 0%, rgba(82,198,141,0.06), transparent 60%)'}} />
      <div style={{position: 'absolute', left: FX, top: FY, width: FW, height: FH, opacity: intro, transform: `scale(${0.96 + intro * 0.04})`, transformOrigin: 'center', background: C.paper, borderRadius: 22, overflow: 'hidden', border: `1px solid ${C.line}`, boxShadow: '0 60px 120px -50px rgba(33,28,22,0.5)'}}>
        {/* window chrome */}
        <div style={{position: 'absolute', top: 0, left: SW, right: 0, height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', borderBottom: `1px solid ${C.line}`, background: C.cardSoft}}>
          <div style={{width: 11, height: 11, borderRadius: '50%', background: '#E2685B'}} />
          <div style={{width: 11, height: 11, borderRadius: '50%', background: '#E7B14C'}} />
          <div style={{width: 11, height: 11, borderRadius: '50%', background: '#5BB36A'}} />
          <div style={{marginLeft: 16, fontFamily: mono, fontSize: 13, color: C.inkSoft}}>app.talous.my</div>
        </div>
        <Sidebar active={active} />
        <div style={{position: 'absolute', left: SW, top: 46, right: 0, bottom: 0}}>
          {active === 0 && <ScreenDashboard f={f} fps={fps} />}
          {active === 1 && <ScreenAudit f={f - 60} fps={fps} />}
          {active === 2 && <ScreenApprovals f={f - 204} fps={fps} />}
          {active === 3 && <ScreenAutomation f={f - 364} fps={fps} />}
        </div>
      </div>
      <Cursor keys={cursor} />
    </AbsoluteFill>
  );
};

/* =================================================================== */
/*  PHONE — WhatsApp update                                            */
/* =================================================================== */
const ScenePhone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 14, PHONE);
  const slide = spring({frame: f - 4, fps, config: {damping: 200, mass: 0.8}});
  const msgs = [
    {delay: 20, me: true, text: 'Morning Aisyah ☀️ Overnight I paused 2 leaking ads and moved the budget to your UGC reel.'},
    {delay: 50, me: true, text: 'Yesterday: RM2,140 in sales from RM860 spend. One thing for you — your clinic booking page is dropping people. Flag it?'},
    {delay: 90, me: false, text: 'Yes please 🙏 thank you!'},
  ];
  return (
    <AbsoluteFill style={{background: C.dusk, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 90, maxWidth: 1500}}>
        <div style={{maxWidth: 560, opacity: slide, transform: `translateX(${(1 - slide) * -40}px)`}}>
          <div style={{fontFamily: mono, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.greenBright}}>No dashboard required</div>
          <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 64, color: C.cream, marginTop: 14, lineHeight: 1.05}}>It updates you where you already are.</div>
          <div style={{fontFamily: hanken, fontSize: 24, color: C.creamSoft, marginTop: 20}}>A plain-language note every morning — on WhatsApp.</div>
        </div>
        <div style={{width: 360, background: '#0d0a08', borderRadius: 40, padding: 14, opacity: slide, transform: `translateY(${(1 - slide) * 40}px)`, boxShadow: '0 50px 90px -40px rgba(0,0,0,0.6)'}}>
          <div style={{background: '#0b1410', borderRadius: 28, overflow: 'hidden'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 18px', background: '#15211b'}}>
              <Avatar name="Talous" from={C.green} to={C.greenBright} size={42} />
              <div><div style={{fontFamily: hanken, fontWeight: 700, fontSize: 19, color: C.cream}}>Talous</div><div style={{fontFamily: hanken, fontSize: 13, color: C.greenBright}}>online</div></div>
            </div>
            <div style={{padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 420}}>
              {msgs.map((m, i) => {
                const s = spring({frame: f - m.delay, fps, config: {damping: 200, mass: 0.6}});
                if (s <= 0.01) return null;
                return (
                  <div key={i} style={{alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '86%', opacity: s, transform: `translateY(${(1 - s) * 14}px) scale(${0.96 + s * 0.04})`, background: m.me ? '#1f6b47' : '#243029', color: C.cream, borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '12px 15px', fontFamily: hanken, fontSize: 17, lineHeight: 1.4}}>{m.text}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =================================================================== */
/*  VALUE — animated dashboard                                         */
/* =================================================================== */
const SceneValue: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 16, VALUE);
  const big = interpolate(f, [14, 80], [0, 81000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bars = [0.35, 0.42, 0.5, 0.68, 0.82, 1.0];
  const card = spring({frame: f - 4, fps, config: {damping: 200, mass: 0.8}});
  return (
    <AbsoluteFill style={{background: C.greenDeep, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(80% 100% at 100% 0, rgba(82,198,141,0.18), transparent 60%)'}} />
      <div style={{display: 'flex', gap: 60, alignItems: 'center'}}>
        <div>
          <div style={{...rise(f, fps, 0), fontFamily: mono, fontSize: 18, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.greenBright}}>Monthly value report</div>
          <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 150, lineHeight: 1, color: C.cream, letterSpacing: '-0.04em', marginTop: 10}}>
            <span style={{color: C.greenBright}}>+RM</span>{Math.round(big).toLocaleString('en-US')}
          </div>
          <div style={{fontFamily: hanken, fontSize: 26, color: 'rgba(243,236,222,0.75)', marginTop: 14}}>extra revenue · 2.5× ROAS · 15 hours back · her first 30 days</div>
        </div>
        <div style={{opacity: card, transform: `translateY(${(1 - card) * 30}px)`, width: 380, height: 300, background: 'rgba(243,236,222,0.06)', border: '1px solid rgba(243,236,222,0.14)', borderRadius: 20, padding: 28, display: 'flex', alignItems: 'flex-end', gap: 16}}>
          {bars.map((b, i) => {
            const h = interpolate(f, [20 + i * 6, 56 + i * 6], [0, b * 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return <div key={i} style={{flex: 1, height: h, borderRadius: 8, background: i === bars.length - 1 ? C.greenBright : 'rgba(82,198,141,0.4)'}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =================================================================== */
/*  PEOPLE — customers + testimonial                                   */
/* =================================================================== */
const PEEPS = [
  {n: 'Aisyah R', from: '#DC8C36', to: '#BC5E36'},
  {n: 'Wei Jian', from: '#2E8B5E', to: '#0E3D27'},
  {n: 'Priya K', from: '#C9512B', to: '#8A2F18'},
  {n: 'Hafiz M', from: '#3A7BD5', to: '#1F3A6E'},
  {n: 'Mei Ling', from: '#9B59B6', to: '#5E2C7A'},
];
const ScenePeople: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 14, PEOPLE);
  return (
    <AbsoluteFill style={{background: C.paper, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', marginBottom: 36}}>
        {PEEPS.map((p, i) => {
          const s = spring({frame: f - (6 + i * 6), fps, config: {damping: 200, mass: 0.6}});
          return <div key={i} style={{marginLeft: i === 0 ? 0 : -22, opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}><Avatar name={p.n} from={p.from} to={p.to} size={84} online={i < 3} /></div>;
        })}
      </div>
      <div style={{...rise(f, fps, 40), fontFamily: fraunces, fontWeight: 600, fontSize: 56, color: C.ink, textAlign: 'center', maxWidth: 1100, lineHeight: 1.12}}>
        “For the first time, I actually know my ad money is working.”
      </div>
      <div style={{...rise(f, fps, 56), fontFamily: hanken, fontSize: 24, color: C.inkSoft, marginTop: 22}}>Aisyah · skincare founder, Shah Alam</div>
      <div style={{...rise(f, fps, 70), fontFamily: mono, fontSize: 17, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.greenD, marginTop: 40}}>Join 200+ Malaysian businesses</div>
    </AbsoluteFill>
  );
};

/* =================================================================== */
/*  CLOSE                                                              */
/* =================================================================== */
const SceneClose: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(14, 18, CLOSE);
  const logo = spring({frame: f - 6, fps, config: {damping: 200, mass: 0.8}});
  return (
    <AbsoluteFill style={{background: C.dusk, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 100% at 50% 0, rgba(82,198,141,0.14), transparent 60%)'}} />
      <div style={{opacity: logo, transform: `translateY(${(1 - logo) * 24}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <LoopMark size={76} stroke={C.greenBright} dot={C.honeyD} />
          <div style={{fontFamily: fraunces, fontWeight: 700, fontSize: 100, color: C.cream, letterSpacing: '-0.03em'}}>talous</div>
        </div>
        <div style={{fontFamily: fraunces, fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: C.honeyD, marginTop: 16}}>Marketing that proves itself.</div>
        <div style={{fontFamily: mono, fontSize: 21, color: C.greenBright, marginTop: 30, letterSpacing: '0.06em'}}>Free ad teardown · talous.my</div>
      </div>
    </AbsoluteFill>
  );
};

/* =================================================================== */
export const TalousDemo: React.FC = () => (
  <AbsoluteFill style={{background: C.dusk}}>
    <Series>
      <Series.Sequence durationInFrames={APP}><AppSection /></Series.Sequence>
      <Series.Sequence durationInFrames={PHONE}><ScenePhone /></Series.Sequence>
      <Series.Sequence durationInFrames={VALUE}><SceneValue /></Series.Sequence>
      <Series.Sequence durationInFrames={PEOPLE}><ScenePeople /></Series.Sequence>
      <Series.Sequence durationInFrames={CLOSE}><SceneClose /></Series.Sequence>
    </Series>
    <Sequence><Grain /></Sequence>
  </AbsoluteFill>
);
