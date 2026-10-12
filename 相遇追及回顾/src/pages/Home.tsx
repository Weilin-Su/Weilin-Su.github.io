import { useRef, useState } from 'react'
import { MeetingSim, ChaseSim } from '../components/TravelSim'
import { PracticeGroup, meetingProblems, chaseProblems } from '../components/Practice'

const INK = '#1c1c1c'
const BLUE = '#0276c3'
const ORANGE = '#ff5306'

/** 一句话总结横幅 */
function SummaryBanner({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="sticker rounded-2xl p-4 sm:p-5 flex items-start gap-3" style={{ backgroundColor: color }}>
      <span className="shrink-0 text-2xl leading-none mt-0.5">💡</span>
      <p className="font-extrabold text-base sm:text-lg leading-relaxed">{children}</p>
    </div>
  )
}

/** 小发现公式条 */
function FormulaBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-full border-2 border-dashed px-5 py-2.5 text-center font-extrabold text-base sm:text-lg bg-white" style={{ borderColor: INK }}>
      {children}
    </div>
  )
}

/** 板块切换大按钮 */
function TabButton({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="press sticker rounded-3xl px-4 py-4 sm:py-5 min-h-[64px] text-xl sm:text-2xl font-black select-none"
      style={
        active
          ? { backgroundColor: color, color: '#fff' }
          : { backgroundColor: '#fff', color: INK }
      }
    >
      {children}
    </button>
  )
}

export default function Home() {
  const [tab, setTab] = useState<'meet' | 'chase'>('meet')
  const tabsRef = useRef<HTMLDivElement>(null)
  const isMeet = tab === 'meet'
  const color = isMeet ? BLUE : ORANGE

  const switchTab = (t: 'meet' | 'chase') => {
    setTab(t)
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e7e0d4', color: INK }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16" style={{ paddingBottom: 'max(4rem, env(safe-area-inset-bottom))' }}>

        {/* ===== 头部 ===== */}
        <header className="pt-10 sm:pt-14 pb-6 text-center">
          <span className="sticker-sm inline-block rounded-full bg-[#fde21f] px-5 py-1.5 text-sm font-extrabold">
            四年级数学 · 预习小课堂
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            相遇问题<span className="mx-2 sm:mx-3 text-[#0276c3]">·</span>追及问题
          </h1>
          <p className="mt-4 text-base sm:text-lg font-bold text-neutral-600">
            下一讲要学「火车过桥」啦！过桥问题里藏着这两种走路问题，先来热身一下～
          </p>
          {/* 装饰小插画：两个小球面对面 */}
          <svg viewBox="0 0 320 60" className="mx-auto mt-6 w-64 sm:w-80" aria-hidden>
            <line x1="10" y1="46" x2="310" y2="46" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
            <g className="idle-bounce">
              <circle cx="60" cy="30" r="16" fill={BLUE} stroke={INK} strokeWidth="2.5" />
              <circle cx="56" cy="26" r="3.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <circle cx="66" cy="26" r="3.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <circle cx="57.5" cy="26" r="1.6" fill={INK} />
              <circle cx="67.5" cy="26" r="1.6" fill={INK} />
              <path d="M 56 35 Q 61 39 66 35" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 82 30 L 96 30 M 90 24 L 97 30 L 90 36" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g className="idle-bounce" style={{ animationDelay: '0.8s' }}>
              <circle cx="260" cy="30" r="16" fill={ORANGE} stroke={INK} strokeWidth="2.5" />
              <circle cx="254" cy="26" r="3.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <circle cx="264" cy="26" r="3.6" fill="#fff" stroke={INK} strokeWidth="1.4" />
              <circle cx="252.5" cy="26" r="1.6" fill={INK} />
              <circle cx="262.5" cy="26" r="1.6" fill={INK} />
              <path d="M 254 35 Q 259 39 264 35" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 238 30 L 224 30 M 230 24 L 223 30 L 230 36" stroke={ORANGE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </header>

        {/* ===== 两个切换大按钮 ===== */}
        <div ref={tabsRef} className="grid grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto scroll-mt-4">
          <TabButton active={isMeet} color={BLUE} onClick={() => switchTab('meet')}>
            相遇问题
          </TabButton>
          <TabButton active={!isMeet} color={ORANGE} onClick={() => switchTab('chase')}>
            追及问题
          </TabButton>
        </div>

        {/* ===== 当前板块：动画演示 ===== */}
        <section key={tab} className="mt-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="sticker-sm rounded-full text-white px-4 py-1 font-extrabold text-sm" style={{ backgroundColor: color }}>
              {isMeet ? '第一种' : '第二种'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {isMeet ? '相遇问题 —— 面对面，往中间走' : '追及问题 —— 同方向，后面追前面'}
            </h2>
          </div>
          <p className="mb-4 font-bold text-neutral-600">
            {isMeet ? (
              <>
                一条 600 米的路，小明从甲地、小红从乙地<strong>同时出发，面对面走</strong>。点「开始走」，盯住线段上方——两人每分钟靠近的路程，正是他们的<strong style={{ color: BLUE }}>「速度和」</strong>！
              </>
            ) : (
              <>
                这回小明先走了一段路，<strong>两人朝同一个方向走</strong>，小红走得快，在后面追。点「开始追」，盯住两人的差距——它每分钟缩小的路程，正是两人的<strong style={{ color: ORANGE }}>「速度差」</strong>！
              </>
            )}
          </p>

          {isMeet ? <MeetingSim /> : <ChaseSim />}

          <div className="mt-4">
            {isMeet ? (
              <>
                <SummaryBanner color="#cdeafe">
                  一句话记住它：面对面走时，两人每分钟一共靠近的路程就是<strong style={{ color: BLUE }}>「速度和」</strong>——相遇时，速度和 × 时间 ＝ 全程，走得快的人走得多，走得慢的人走得少。
                </SummaryBanner>
                <FormulaBar>
                  <span style={{ color: BLUE }}>速度和</span> × 相遇时间 ＝ 总路程（两人走的路合起来）
                </FormulaBar>
                <FormulaBar>
                  <span className="mr-2 text-sm font-bold text-neutral-500">符号公式</span>
                  <span className="font-serif italic">s</span><sub>和</sub> ＝ <span className="font-serif italic">v</span><sub>和</sub> × <span className="font-serif italic">t</span>
                  <span className="ml-3 text-sm font-bold text-neutral-500">（s<sub>和</sub>：两人共走的路程　v<sub>和</sub>：速度和　t：时间）</span>
                </FormulaBar>
              </>
            ) : (
              <>
                <SummaryBanner color="#ffd9c7">
                  一句话记住它：快的人追慢的人，每分钟差距缩小的路程就是两人的<strong style={{ color: ORANGE }}>「速度差」</strong>——追上时，速度差 × 时间 ＝ 出发时落后的距离。
                </SummaryBanner>
                <FormulaBar>
                  <span style={{ color: ORANGE }}>速度差</span> × 追及时间 ＝ 路程差（开始时的差距）
                </FormulaBar>
                <FormulaBar>
                  <span className="mr-2 text-sm font-bold text-neutral-500">符号公式</span>
                  <span className="font-serif italic">s</span><sub>差</sub> ＝ <span className="font-serif italic">v</span><sub>差</sub> × <span className="font-serif italic">t</span>
                  <span className="ml-3 text-sm font-bold text-neutral-500">（s<sub>差</sub>：开始时的差距　v<sub>差</sub>：速度差　t：时间）</span>
                </FormulaBar>
              </>
            )}
          </div>
        </section>

        {/* ===== 当前板块：练一练 ===== */}
        <section className="mt-12">
          <div className="text-center mb-8">
            <span className="sticker-sm inline-block rounded-full bg-[#008a43] text-white px-4 py-1 font-extrabold text-sm">动手动脑</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black">练一练（3 题）</h2>
            <p className="mt-2 font-bold text-neutral-600">先自己在草稿本上算一算，再点「对答案」检查哦！</p>
          </div>
          <PracticeGroup
            key={tab}
            title={isMeet ? '相遇问题 · 练一练' : '追及问题 · 练一练'}
            subtitle={isMeet ? '关键词：面对面、一起走、路程加起来是全程' : '关键词：同方向、快的追慢的、多走的路补差距'}
            problems={isMeet ? meetingProblems : chaseProblems}
            color={color}
          />
        </section>

        {/* ===== 下一讲预告 ===== */}
        <footer className="mt-14">
          <div className="sticker rounded-3xl bg-[#1c1c1c] text-white p-5 sm:p-6">
            <div className="font-extrabold text-lg sm:text-xl flex items-center gap-2">
              <span>🚂</span> 下一讲预告：火车过桥
            </div>
            <p className="mt-2 font-semibold text-white/85 leading-relaxed">
              火车过桥时，可以把「桥」想成一位站在原地不动的朋友——这就变成了我们刚练过的问题！
              不过要注意：火车自己也有长度，从车头进桥到车尾离桥才算过完。带着今天的「相遇」和「追及」，下节课见！
            </p>
          </div>
          <p className="mt-6 text-center text-sm font-bold text-neutral-500">四年级数学预习 · 相遇问题与追及问题</p>
        </footer>
      </div>
    </div>
  )
}
