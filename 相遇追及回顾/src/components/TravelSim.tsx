import { useEffect, useRef, useState } from 'react'

/* ========== 通用小工具 ========== */

/** 数字显示：接近整数就显示整数，否则保留 1 位小数 */
function fmt(n: number): string {
  const r = Math.round(n)
  return Math.abs(n - r) < 0.05 ? String(r) : n.toFixed(1)
}

/** requestAnimationFrame 循环：active 时每帧回调 dt（秒） */
function useRafLoop(active: boolean, tick: (dt: number) => void) {
  const ref = useRef(tick)
  ref.current = tick
  useEffect(() => {
    if (!active) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      ref.current(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
}

/* ========== 场景小零件 ========== */

const INK = '#1c1c1c'
const BLUE = '#0276c3'
const ORANGE = '#ff5306'
const GREEN = '#008a43'
const YELLOW = '#fde21f'

/** 带表情的小球：眼睛看向运动方向 */
function Ball({ x, y, color, name, dir, idle }: { x: number; y: number; color: string; name: string; dir: 1 | -1; idle: boolean }) {
  const ex = dir * 4
  return (
    <g className={idle ? 'idle-bounce' : undefined} style={{ transformBox: 'fill-box' }}>
      <circle cx={x} cy={y} r={19} fill={color} stroke={INK} strokeWidth={2.5} />
      {/* 眼睛 */}
      <circle cx={x - 6 + ex} cy={y - 4} r={4.6} fill="#fff" stroke={INK} strokeWidth={1.6} />
      <circle cx={x + 7 + ex} cy={y - 4} r={4.6} fill="#fff" stroke={INK} strokeWidth={1.6} />
      <circle cx={x - 6 + ex + dir * 1.8} cy={y - 4} r={2.1} fill={INK} />
      <circle cx={x + 7 + ex + dir * 1.8} cy={y - 4} r={2.1} fill={INK} />
      {/* 微笑 */}
      <path d={`M ${x - 4 + ex} ${y + 6} Q ${x + ex} ${y + 10.5} ${x + 5 + ex} ${y + 6}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* 名字牌 */}
      <text x={x} y={y - 30} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{name}</text>
    </g>
  )
}

/** 终点星星（相遇/追上的标记） */
function Star({ x, y }: { x: number; y: number }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 16 : 7
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`)
  }
  return (
    <g className="pop-star">
      <polygon points={pts.join(' ')} fill={YELLOW} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  )
}

/** 地点小旗 */
function Flag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 34} stroke={INK} strokeWidth={2.5} />
      <path d={`M ${x} ${y - 34} L ${x + 20} ${y - 27} L ${x} ${y - 20} Z`} fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <text x={x} y={y + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{label}</text>
    </g>
  )
}

/** 大按钮 */
function BigButton({ onClick, color, children }: { onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="press sticker-sm rounded-full px-7 min-h-[48px] text-base font-extrabold text-white select-none"
      style={{ backgroundColor: color }}
    >
      {children}
    </button>
  )
}

/** 速度滑块 */
function SpeedSlider({ label, value, min, max, color, onChange }: { label: string; value: number; min: number; max: number; color: string; onChange: (v: number) => void }) {
  return (
    <label className="block flex-1 min-w-[220px]">
      <span className="flex items-center justify-between text-sm font-bold mb-0.5">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3.5 h-3.5 rounded-full border-2" style={{ backgroundColor: color, borderColor: INK }} />
          {label}
        </span>
        <span className="sticker-sm rounded-full bg-white px-3 py-0.5 text-sm font-extrabold">{value} 米/分</span>
      </span>
      <input
        type="range"
        className="big-slider"
        style={{ ['--thumb-color' as string]: color }}
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

/** 实时数据小卡 */
function Stat({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div className="sticker-sm rounded-2xl px-3 py-2 text-center" style={{ backgroundColor: highlight ? YELLOW : '#fff' }}>
      <div className="text-xs font-bold text-neutral-500">{label}</div>
      <div className="text-lg font-extrabold" style={{ color }}>{value}</div>
    </div>
  )
}

/** 速度和 / 速度差 强调条 */
function RateChip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="sticker-sm mt-3 rounded-2xl px-4 py-2.5 text-center font-extrabold text-sm sm:text-base leading-relaxed" style={{ backgroundColor: color }}>
      {children}
    </div>
  )
}

/* ========== 场景骨架：轨道 + 刻度 ========== */

const VB_W = 800
const PAD = 44
const TRACK_Y = 150

function tickStep(L: number) {
  if (L <= 700) return 100
  if (L <= 1400) return 200
  return 400
}

function Track({ L, children, topNote }: { L: number; children: React.ReactNode; topNote?: React.ReactNode }) {
  const m2px = (VB_W - PAD * 2) / L
  const step = tickStep(L)
  const ticks: number[] = []
  for (let v = 0; v <= L; v += step) ticks.push(v)
  return (
    <svg viewBox={`0 0 ${VB_W} 230`} className="w-full h-auto select-none" role="img" aria-label="路程线段图">
      {/* 刻度 */}
      {ticks.map((v) => (
        <g key={v}>
          <line x1={PAD + v * m2px} y1={TRACK_Y + 8} x2={PAD + v * m2px} y2={TRACK_Y + 16} stroke={INK} strokeWidth={2} />
          <text x={PAD + v * m2px} y={TRACK_Y + 60} textAnchor="middle" fontSize={12} fontWeight={600} fill="#6b6257">{v === 0 ? '0' : `${v}米`}</text>
        </g>
      ))}
      {topNote}
      {children}
      {/* 轨道主线 */}
      <line x1={PAD} y1={TRACK_Y} x2={VB_W - PAD} y2={TRACK_Y} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  )
}

/* ========== ① 相遇问题模拟器 ========== */

export function MeetingSim() {
  const L = 600 // 全程 600 米
  const SCALE = 1.2 // 现实 1 秒 = 图中 1.2 分钟
  const [vA, setVA] = useState(60) // 小明（蓝，左→右）
  const [vB, setVB] = useState(40) // 小红（橙，右→左）
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [t, setT] = useState(0)
  const [dA, setDA] = useState(0)
  const [dB, setDB] = useState(0)

  useRafLoop(running && !done, (dt) => {
    const stepReal = dt * SCALE
    const need = (L - dA - dB) / (vA + vB)
    const step = Math.min(stepReal, Math.max(need, 0))
    const nDA = dA + vA * step
    const nDB = dB + vB * step
    setDA(nDA)
    setDB(nDB)
    setT((prev) => prev + step)
    if (need <= stepReal + 1e-9) {
      setDone(true)
      setRunning(false)
    }
  })

  const reset = () => {
    setRunning(false)
    setDone(false)
    setT(0)
    setDA(0)
    setDB(0)
  }

  const m2px = (VB_W - PAD * 2) / L
  const x = (m: number) => PAD + m * m2px
  const gap = Math.max(L - dA - dB, 0)
  const meetX = x(dA)

  return (
    <div className="sticker rounded-3xl bg-white p-4 sm:p-6">
      <Track L={L}>
        {/* 两人已走的路程染色 */}
        {dA > 0.5 && <line x1={x(0)} y1={TRACK_Y} x2={x(Math.min(dA, L))} y2={TRACK_Y} stroke={BLUE} strokeWidth={9} strokeLinecap="round" opacity={0.3} />}
        {dB > 0.5 && <line x1={x(L)} y1={TRACK_Y} x2={x(L - Math.min(dB, L))} y2={TRACK_Y} stroke={ORANGE} strokeWidth={9} strokeLinecap="round" opacity={0.3} />}
        {/* 剩余距离提示：强调每分钟按「速度和」靠近 */}
        {!done && (dA > 0 || dB > 0) && gap > 1 && (
          <g>
            <line x1={x(dA) + 26} y1={TRACK_Y - 46} x2={x(L - dB) - 26} y2={TRACK_Y - 46} stroke={INK} strokeWidth={1.8} strokeDasharray="6 5" />
            <text x={(x(dA) + x(L - dB)) / 2} y={TRACK_Y - 56} textAnchor="middle" fontSize={13.5} fontWeight={800} fill={INK}>
              相距 {Math.round(gap)} 米
            </text>
          </g>
        )}
        {/* 起点小旗 */}
        <Flag x={x(0)} y={TRACK_Y} label="甲地" color={BLUE} />
        <g transform={`translate(${x(L)},0) scale(-1,1)`}>
          <Flag x={0} y={TRACK_Y} label="" color={ORANGE} />
        </g>
        <text x={x(L)} y={TRACK_Y + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>乙地</text>
        {/* 小球（相遇后左右错开一点，两个都看得见） */}
        <Ball x={x(dA) - (done ? 26 : 0)} y={TRACK_Y - 24} color={BLUE} name="小明" dir={1} idle={!running && !done && t === 0} />
        <Ball x={x(L - dB) + (done ? 26 : 0)} y={TRACK_Y - 24} color={ORANGE} name="小红" dir={-1} idle={!running && !done && t === 0} />
        {done && <Star x={meetX} y={TRACK_Y - 84} />}
      </Track>

      {/* 控制区 */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!running ? (
          <BigButton color={GREEN} onClick={() => (done ? reset() : setRunning(true))}>
            {done ? '再看一遍' : t === 0 ? '▶ 开始走' : '▶ 继续'}
          </BigButton>
        ) : (
          <BigButton color={ORANGE} onClick={() => setRunning(false)}>⏸ 暂停</BigButton>
        )}
        {(t > 0 || done) && !done && (
          <BigButton color={INK} onClick={reset}>↺ 重来</BigButton>
        )}
        {done && (
          <BigButton color={INK} onClick={reset}>↺ 换个速度再试</BigButton>
        )}
      </div>
      <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-5">
        <SpeedSlider label="小明的速度" value={vA} min={30} max={90} color={BLUE} onChange={setVA} />
        <SpeedSlider label="小红的速度" value={vB} min={30} max={90} color={ORANGE} onChange={setVB} />
      </div>

      {/* 速度和强调条 */}
      <RateChip color="#cdeafe">
        速度和 ＝ {vA} ＋ {vB} ＝ <span className="text-lg sm:text-xl" style={{ color: BLUE }}>{vA + vB}</span>（米/分）
        —— 两人每分钟一共靠近 {vA + vB} 米
      </RateChip>

      {/* 实时数据 */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <Stat label={`速度和 ${vA}＋${vB}`} value={`${vA + vB} 米/分`} color={BLUE} highlight />
        <Stat label="经过时间" value={`${fmt(t)} 分钟`} color={INK} />
        <Stat label="小明走了" value={`${fmt(dA)} 米`} color={BLUE} />
        <Stat label="小红走了" value={`${fmt(dB)} 米`} color={ORANGE} />
        <Stat label="两人共走" value={`${fmt(dA + dB)} / ${L} 米`} color={GREEN} />
      </div>

      {/* 结果横幅 */}
      {done && (
        <div className="unfold sticker-sm mt-4 rounded-2xl px-4 py-3 font-extrabold text-base sm:text-lg" style={{ backgroundColor: YELLOW }}>
          🎉 相遇啦！速度和 {vA}＋{vB}＝{vA + vB} 米/分，{L}÷{vA + vB}{Math.abs(t - Math.round(t)) < 0.05 ? '＝' : '≈'}{fmt(t)} 分钟碰头！
          小明 {fmt(dA)} 米 ＋ 小红 {fmt(dB)} 米 ＝ {L} 米，正好拼成一整条路！
        </div>
      )}
    </div>
  )
}

/* ========== ② 追及问题模拟器 ========== */

export function ChaseSim() {
  const SCALE = 1.2
  const [headStart, setHeadStart] = useState(240) // 小明先走的距离
  const [vSlow, setVSlow] = useState(50) // 小明（蓝，在前）
  const [vFast, setVFast] = useState(90) // 小红（橙，在后追）
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [t, setT] = useState(0)
  const [dSlow, setDSlow] = useState(0)
  const [dFast, setDFast] = useState(0)

  const gapNow = Math.max(headStart + dSlow - dFast, 0)

  useRafLoop(running && !done, (dt) => {
    const stepReal = dt * SCALE
    const need = (headStart + dSlow - dFast) / (vFast - vSlow)
    const step = Math.min(stepReal, Math.max(need, 0))
    const nDS = dSlow + vSlow * step
    const nDF = dFast + vFast * step
    setDSlow(nDS)
    setDFast(nDF)
    setT((prev) => prev + step)
    if (need <= stepReal + 1e-9) {
      setDone(true)
      setRunning(false)
    }
  })

  const reset = () => {
    setRunning(false)
    setDone(false)
    setT(0)
    setDSlow(0)
    setDFast(0)
  }

  // 轨道长度随参数自适应，保证追得上、不出界
  const tCatch = headStart / (vFast - vSlow)
  const needLen = headStart + vSlow * tCatch + 120
  const L = Math.max(600, Math.ceil(needLen / 100) * 100)
  const m2px = (VB_W - PAD * 2) / L
  const x = (m: number) => PAD + m * m2px
  const slowX = x(headStart + dSlow)
  const fastX = x(dFast)

  return (
    <div className="sticker rounded-3xl bg-white p-4 sm:p-6">
      <Track L={L}>
        {/* 已走的路程染色 */}
        {dSlow > 0.5 && <line x1={x(headStart)} y1={TRACK_Y} x2={x(headStart + dSlow)} y2={TRACK_Y} stroke={BLUE} strokeWidth={9} strokeLinecap="round" opacity={0.3} />}
        {dFast > 0.5 && <line x1={x(0)} y1={TRACK_Y} x2={x(dFast)} y2={TRACK_Y} stroke={ORANGE} strokeWidth={9} strokeLinecap="round" opacity={0.3} />}
        {/* 小明一开始领先的距离 */}
        {t === 0 && (
          <g>
            <line x1={x(0) + 8} y1={TRACK_Y - 52} x2={x(headStart) - 8} y2={TRACK_Y - 52} stroke={INK} strokeWidth={1.8} strokeDasharray="6 5" />
            <text x={(x(0) + x(headStart)) / 2} y={TRACK_Y - 62} textAnchor="middle" fontSize={13.5} fontWeight={800} fill={INK}>
              小明先走 {headStart} 米
            </text>
          </g>
        )}
        {/* 追赶中：差距按「速度差」每分钟缩小 */}
        {t > 0 && !done && gapNow > 1 && (
          <g>
            <line x1={fastX + 26} y1={TRACK_Y - 52} x2={slowX - 26} y2={TRACK_Y - 52} stroke={INK} strokeWidth={1.8} strokeDasharray="6 5" />
            <text x={(fastX + slowX) / 2} y={TRACK_Y - 62} textAnchor="middle" fontSize={13.5} fontWeight={800} fill={INK}>
              相距 {Math.round(gapNow)} 米
            </text>
          </g>
        )}
        {/* 起点小旗 */}
        <Flag x={x(0)} y={TRACK_Y} label="出发点" color={GREEN} />
        {/* 小球：两人朝同一方向（右）（追上后左右错开一点） */}
        <Ball x={slowX + (done ? 26 : 0)} y={TRACK_Y - 24} color={BLUE} name="小明" dir={1} idle={!running && !done && t === 0} />
        <Ball x={fastX - (done ? 26 : 0)} y={TRACK_Y - 24} color={ORANGE} name="小红" dir={1} idle={!running && !done && t === 0} />
        {done && <Star x={slowX} y={TRACK_Y - 84} />}
      </Track>

      {/* 控制区 */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!running ? (
          <BigButton color={GREEN} onClick={() => (done ? reset() : setRunning(true))}>
            {done ? '再看一遍' : t === 0 ? '▶ 开始追' : '▶ 继续'}
          </BigButton>
        ) : (
          <BigButton color={ORANGE} onClick={() => setRunning(false)}>⏸ 暂停</BigButton>
        )}
        {(t > 0 || done) && (
          <BigButton color={INK} onClick={reset}>↺ 重来</BigButton>
        )}
      </div>
      <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-5">
        <SpeedSlider label="小明（在前，慢）" value={vSlow} min={40} max={60} color={BLUE} onChange={setVSlow} />
        <SpeedSlider label="小红（在后，快）" value={vFast} min={75} max={105} color={ORANGE} onChange={setVFast} />
      </div>
      <label className="block mt-1">
        <span className="flex items-center justify-between text-sm font-bold mb-0.5">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-3.5 rounded-full border-2" style={{ backgroundColor: GREEN, borderColor: INK }} />
            小明先走的距离
          </span>
          <span className="sticker-sm rounded-full bg-white px-3 py-0.5 text-sm font-extrabold">{headStart} 米</span>
        </span>
        <input
          type="range"
          className="big-slider"
          style={{ ['--thumb-color' as string]: GREEN }}
          min={120}
          max={300}
          step={20}
          value={headStart}
          onChange={(e) => setHeadStart(Number(e.target.value))}
        />
      </label>

      {/* 速度差强调条 */}
      <RateChip color="#ffd9c7">
        速度差 ＝ {vFast} − {vSlow} ＝ <span className="text-lg sm:text-xl" style={{ color: ORANGE }}>{vFast - vSlow}</span>（米/分）
        —— 小红每分钟多走 {vFast - vSlow} 米，差距就缩小 {vFast - vSlow} 米
      </RateChip>

      {/* 实时数据 */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <Stat label={`速度差 ${vFast}−${vSlow}`} value={`${vFast - vSlow} 米/分`} color={ORANGE} highlight />
        <Stat label="经过时间" value={`${fmt(t)} 分钟`} color={INK} />
        <Stat label="小明又走了" value={`${fmt(dSlow)} 米`} color={BLUE} />
        <Stat label="小红走了" value={`${fmt(dFast)} 米`} color={ORANGE} />
        <Stat label="两人差距" value={`还剩 ${fmt(gapNow)} 米`} color={GREEN} />
      </div>

      {/* 结果横幅 */}
      {done && (
        <div className="unfold sticker-sm mt-4 rounded-2xl px-4 py-3 font-extrabold text-base sm:text-lg" style={{ backgroundColor: YELLOW }}>
          🎉 追上啦！速度差 {vFast}−{vSlow}＝{vFast - vSlow} 米/分，{headStart}÷{vFast - vSlow}{Math.abs(t - Math.round(t)) < 0.05 ? '＝' : '≈'}{fmt(t)} 分钟追上！
          小红多走的 {fmt(dFast)}−{fmt(dSlow)}＝{headStart} 米，正好补上开始的差距！
        </div>
      )}
    </div>
  )
}
