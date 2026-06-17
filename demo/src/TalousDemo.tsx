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
const S1 = 130, S2 = 130, S3 = 160, S4 = 185, S5 = 160, S6 = 135;
export const DEMO_DURATION = S1 + S2 + S3 + S4 + S5 + S6; // 900 = 30s

/* ---------------- palette (matches the site) ---------------- */
const C = {
  dusk: '#181410', dusk2: '#211B15', dusk3: '#2C241C',
  paper: '#F6F1E7', cream: '#F3ECDE', creamSoft: '#C7BBA7',
  green: '#1F6B47', greenD: '#52C68D', greenDeep: '#0E3D27',
  honey: '#DC8C36', honeyD: '#F3B85F', clay: '#BC5E36', killD: '#F0936A',
  ink: '#211C16',
};

/* ---------------- helpers ---------------- */
const useFade = (inDur = 12, outDur = 14, total?: number) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const end = total ?? durationInFrames;
  const fin = interpolate(frame, [0, inDur], [0, 1], {extrapolateRight: 'clamp'});
  const fout = interpolate(frame, [end - outDur, end], [1, 0], {extrapolateLeft: 'clamp'});
  return Math.min(fin, fout);
};

const rise = (frame: number, fps: number, delay = 0, dist = 40) => {
  const s = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7}});
  return {opacity: s, transform: `translateY(${(1 - s) * dist}px)`};
};

const LoopMark: React.FC<{size?: number; stroke?: string; dot?: string; rot?: number}> = ({
  size = 64, stroke = C.greenD, dot = C.honeyD, rot = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
    style={{transform: `rotate(${rot}deg)`}}>
    <path d="M16 4c-5 0-8 3.2-8 7.4 0 4.6 3.8 6.7 8 8.2 4.2 1.5 8 3.6 8 8.2 0 4.2-3 7.4-8 7.4"
      stroke={stroke} strokeWidth={3} strokeLinecap="round" />
    <circle cx="16" cy="16" r="2.6" fill={dot} />
  </svg>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{
      background: 'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.45) 100%)',
    }} />
    <AbsoluteFill style={{
      opacity: 0.05, mixBlendMode: 'overlay',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }} />
  </AbsoluteFill>
);

const chipStyle = (bg: string, fg: string): React.CSSProperties => ({
  fontFamily: mono, fontSize: 22, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px', borderRadius: 12,
  background: bg, color: fg, display: 'inline-block',
});

/* ============================================================= */
/* SCENE 1 — Cold open                                            */
/* ============================================================= */
const SceneOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(14, 16, S1);
  const glow = interpolate(frame, [0, 60], [0.2, 0.7], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.dusk, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      {/* laptop glow */}
      <div style={{
        position: 'absolute', bottom: 120, width: 620, height: 340,
        background: `radial-gradient(60% 80% at 50% 100%, rgba(243,184,95,${glow * 0.35}), transparent 70%)`,
        filter: 'blur(8px)',
      }} />
      <div style={{position: 'absolute', top: 150, fontFamily: mono, fontSize: 26, letterSpacing: '0.3em', color: C.creamSoft}}>
        23:47
      </div>
      <div style={{textAlign: 'center', maxWidth: 1200, padding: '0 80px'}}>
        <div style={{...rise(frame, fps, 18), fontFamily: fraunces, fontWeight: 600, fontSize: 96, lineHeight: 1.05, color: C.cream, letterSpacing: '-0.02em'}}>
          This was Aisyah.
        </div>
        <div style={{...rise(frame, fps, 40), fontFamily: fraunces, fontWeight: 500, fontStyle: 'italic', fontSize: 70, color: C.honeyD, marginTop: 10}}>
          Every single night.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================= */
/* SCENE 2 — The problem                                          */
/* ============================================================= */
const jargon = [
  {t: 'ROAS', x: 300, y: 240}, {t: 'CTR', x: 1450, y: 300},
  {t: 'CPA', x: 250, y: 760}, {t: 'CPM', x: 1480, y: 740},
  {t: 'frequency', x: 1150, y: 180}, {t: 'attribution', x: 520, y: 900},
];
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 14, S2);
  const stamp = spring({frame: frame - 30, fps, config: {damping: 12, mass: 0.8}});
  return (
    <AbsoluteFill style={{background: C.dusk2, opacity: op}}>
      {jargon.map((j, i) => {
        const a = interpolate(frame, [i * 4, i * 4 + 24], [0, 0.28], {extrapolateRight: 'clamp'});
        const drift = interpolate(frame, [0, S2], [0, -18]);
        return (
          <div key={j.t} style={{
            position: 'absolute', left: j.x, top: j.y + drift, opacity: a,
            fontFamily: mono, fontSize: 34, color: C.creamSoft, letterSpacing: '0.08em',
          }}>{j.t}</div>
        );
      })}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{
          transform: `rotate(-6deg) scale(${stamp})`, opacity: stamp,
          border: `4px solid ${C.clay}`, borderRadius: 14, padding: '18px 40px',
          color: C.killD, fontFamily: mono, fontWeight: 600, fontSize: 64, letterSpacing: '0.04em',
        }}>RM9,000 / mo</div>
        <div style={{...rise(frame, fps, 55), marginTop: 56, maxWidth: 1100, textAlign: 'center',
          fontFamily: fraunces, fontWeight: 600, fontSize: 58, lineHeight: 1.1, color: C.cream, letterSpacing: '-0.02em'}}>
          An agency she paid every month — for a report she couldn’t read.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================= */
/* SCENE 3 — The turn (the 5-stage loop)                          */
/* ============================================================= */
const STAGES = ['Sync', 'Audit', 'Memory', 'Guard', 'Execute'];
const SceneLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 14, S3);
  return (
    <AbsoluteFill style={{background: C.greenDeep, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 60% at 50% 30%, rgba(82,198,141,0.16), transparent 60%)'}} />
      <div style={{...rise(frame, fps, 6), fontFamily: fraunces, fontWeight: 600, fontSize: 64, color: C.cream, marginBottom: 70, textAlign: 'center', letterSpacing: '-0.02em'}}>
        While she slept, <span style={{color: C.honeyD}}>Talous got to work.</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        {STAGES.map((s, i) => {
          const delay = 30 + i * 16;
          const sp = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}});
          const lit = interpolate(frame, [delay, delay + 10], [0, 1], {extrapolateRight: 'clamp'});
          return (
            <React.Fragment key={s}>
              <div style={{
                opacity: sp, transform: `translateY(${(1 - sp) * 26}px)`,
                padding: '22px 30px', borderRadius: 16,
                background: lit > 0.5 ? 'rgba(82,198,141,0.16)' : 'rgba(243,236,222,0.05)',
                border: `1.5px solid ${lit > 0.5 ? C.greenD : 'rgba(243,236,222,0.16)'}`,
                color: lit > 0.5 ? C.greenD : C.creamSoft,
                fontFamily: mono, fontSize: 30, fontWeight: 600, minWidth: 150, textAlign: 'center',
                transition: 'all .2s',
              }}>
                <div style={{fontSize: 16, opacity: 0.7, marginBottom: 6}}>{`0${i + 1}`}</div>
                {s}
              </div>
              {i < STAGES.length - 1 && (
                <div style={{width: 36, height: 2, background: 'rgba(243,236,222,0.2)',
                  opacity: interpolate(frame, [delay + 8, delay + 16], [0, 1], {extrapolateRight: 'clamp'})}} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{marginTop: 70, opacity: interpolate(frame, [110, 130], [0, 1], {extrapolateRight: 'clamp'})}}>
        <LoopMark size={70} rot={interpolate(frame, [110, S3], [0, 200])} />
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================= */
/* SCENE 4 — The Decision Journal                                 */
/* ============================================================= */
const JOURNAL = [
  {chip: 'Killed', cbg: 'rgba(188,94,54,0.22)', cfg: C.killD, action: 'Paused “Raya Promo — Video 3”',
    reason: 'RM412 spent, zero sales in 6 days. Stopped the leak.', conf: 94, meter: C.killD},
  {chip: 'Scaled', cbg: 'rgba(82,198,141,0.18)', cfg: C.greenD, action: 'Raised “Bestseller — UGC” budget +40%',
    reason: 'RM2.80 per sale — your best performer. Gave it room.', conf: 88, meter: C.greenD},
  {chip: 'Flagged', cbg: 'rgba(243,184,95,0.18)', cfg: C.honeyD, action: 'Funnel leak on “Clinic Leads”',
    reason: 'Clicks are healthy, but the booking page isn’t converting.', conf: 76, meter: C.honeyD},
];
const SceneJournal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 14, S4);
  return (
    <AbsoluteFill style={{background: C.dusk, opacity: op, justifyContent: 'center', alignItems: 'center', padding: '0 160px'}}>
      <div style={{alignSelf: 'flex-start', marginLeft: 160, marginBottom: 36, ...rise(frame, fps, 4)}}>
        <div style={{fontFamily: mono, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.greenD}}>The Decision Journal</div>
        <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 56, color: C.cream, marginTop: 8, letterSpacing: '-0.02em'}}>
          We don’t ask you to trust us. We show you.
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20, width: 1300}}>
        {JOURNAL.map((j, i) => {
          const delay = 26 + i * 22;
          const sp = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7}});
          const w = interpolate(frame, [delay + 8, delay + 40], [0, j.conf], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{
              opacity: sp, transform: `translateX(${(1 - sp) * -40}px)`,
              display: 'grid', gridTemplateColumns: '150px 1fr 150px', alignItems: 'center', gap: 30,
              background: C.dusk2, border: '1px solid rgba(243,236,222,0.13)', borderRadius: 16, padding: '26px 34px',
            }}>
              <span style={chipStyle(j.cbg, j.cfg)}>{j.chip}</span>
              <div>
                <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 30, color: C.cream}}>{j.action}</div>
                <div style={{fontFamily: hanken, fontSize: 21, color: C.creamSoft, marginTop: 6}}>{j.reason}</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontFamily: mono, fontWeight: 600, fontSize: 38, color: j.meter}}>{Math.round(w)}%</div>
                <div style={{height: 6, background: 'rgba(243,236,222,0.13)', borderRadius: 4, marginTop: 8, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${w}%`, background: j.meter, borderRadius: 4}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================= */
/* SCENE 5 — Value report                                         */
/* ============================================================= */
const SceneValue: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(12, 16, S5);
  const big = interpolate(frame, [10, 75], [0, 81000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const roas = interpolate(frame, [20, 80], [0, 2.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hrs = interpolate(frame, [30, 85], [0, 15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.greenDeep, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: 'radial-gradient(80% 100% at 100% 0, rgba(82,198,141,0.18), transparent 60%)'}} />
      <div style={{...rise(frame, fps, 4), fontFamily: mono, fontSize: 24, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.greenD, marginBottom: 20}}>
        Her first 30 days
      </div>
      <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 180, lineHeight: 1, color: C.cream, letterSpacing: '-0.04em'}}>
        <span style={{color: C.greenD}}>+RM</span>{Math.round(big).toLocaleString('en-US')}
      </div>
      <div style={{fontFamily: hanken, fontSize: 28, color: 'rgba(243,236,222,0.75)', marginTop: 18}}>
        extra revenue from the same ad budget
      </div>
      <div style={{display: 'flex', gap: 90, marginTop: 60, opacity: interpolate(frame, [55, 80], [0, 1], {extrapolateRight: 'clamp'})}}>
        <Stat v={`${roas.toFixed(1)}×`} l="return on ad spend" />
        <Stat v={`${Math.round(hrs)} hrs`} l="reclaimed every week" />
        <Stat v="RM0" l="hours she spent on it" />
      </div>
    </AbsoluteFill>
  );
};
const Stat: React.FC<{v: string; l: string}> = ({v, l}) => (
  <div style={{textAlign: 'center'}}>
    <div style={{fontFamily: fraunces, fontWeight: 600, fontSize: 64, color: C.cream}}>{v}</div>
    <div style={{fontFamily: hanken, fontSize: 22, color: 'rgba(243,236,222,0.65)', marginTop: 6}}>{l}</div>
  </div>
);

/* ============================================================= */
/* SCENE 6 — Close                                                */
/* ============================================================= */
const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = useFade(14, 18, S6);
  const line = interpolate(frame, [0, 50], [1, 0], {extrapolateRight: 'clamp'});
  const logo = spring({frame: frame - 45, fps, config: {damping: 200, mass: 0.8}});
  return (
    <AbsoluteFill style={{background: C.dusk, opacity: op, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', opacity: line, maxWidth: 1100, textAlign: 'center', padding: '0 80px',
        fontFamily: fraunces, fontStyle: 'italic', fontWeight: 500, fontSize: 56, color: C.cream, lineHeight: 1.2}}>
        She stopped watching her ads. They got better anyway.
      </div>
      <div style={{opacity: logo, transform: `translateY(${(1 - logo) * 24}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <LoopMark size={72} stroke={C.green} dot={C.honey} />
          <div style={{fontFamily: fraunces, fontWeight: 700, fontSize: 96, color: C.cream, letterSpacing: '-0.03em'}}>talous</div>
        </div>
        <div style={{fontFamily: hanken, fontSize: 30, color: C.creamSoft, marginTop: 18}}>Marketing that proves itself.</div>
        <div style={{fontFamily: mono, fontSize: 20, color: C.greenD, marginTop: 28, letterSpacing: '0.06em'}}>
          Free ad teardown · talous.my
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================= */
/* ROOT                                                           */
/* ============================================================= */
export const TalousDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.dusk}}>
      <Series>
        <Series.Sequence durationInFrames={S1}><SceneOpen /></Series.Sequence>
        <Series.Sequence durationInFrames={S2}><SceneProblem /></Series.Sequence>
        <Series.Sequence durationInFrames={S3}><SceneLoop /></Series.Sequence>
        <Series.Sequence durationInFrames={S4}><SceneJournal /></Series.Sequence>
        <Series.Sequence durationInFrames={S5}><SceneValue /></Series.Sequence>
        <Series.Sequence durationInFrames={S6}><SceneClose /></Series.Sequence>
      </Series>
      <Sequence>
        <Grain />
      </Sequence>
    </AbsoluteFill>
  );
};
