import { useState } from 'react'

type Problem = {
  question: string
  steps: string[]
  answer: string
}

export const meetingProblems: Problem[] = [
  {
    question:
      '甲、乙两地相距 360 千米。客车从甲地出发开往乙地，每小时行 55 千米；货车同时从乙地出发开往甲地，每小时行 35 千米。两车出发几小时后相遇？',
    steps: ['两车每小时一共靠近：55＋35＝90（千米）', '相遇时间：360÷90＝4（小时）'],
    answer: '出发 4 小时后相遇。',
  },
  {
    question:
      '小明和小红同时从相距 900 米的两地出发，面对面行走。小明每分钟走 60 米，小红每分钟走 40 米。相遇时小明走了多少米？',
    steps: ['两人每分钟共走：60＋40＝100（米）', '相遇时间：900÷100＝9（分钟）', '小明走了：60×9＝540（米）'],
    answer: '相遇时小明走了 540 米。',
  },
  {
    question:
      '两列火车同时从相距 480 千米的两个车站相对开出，4 小时后在途中相遇。已知快车每小时行 65 千米，慢车每小时行多少千米？',
    steps: ['两车每小时共行：480÷4＝120（千米）', '慢车每小时行：120−65＝55（千米）'],
    answer: '慢车每小时行 55 千米。',
  },
]

export const chaseProblems: Problem[] = [
  {
    question:
      '小明每分钟走 60 米，小红每分钟走 80 米。小明先走了 120 米，小红才从同一地点出发去追他。小红出发几分钟后追上小明？',
    steps: ['小红每分钟多走：80−60＝20（米）', '追及时间：120÷20＝6（分钟）'],
    answer: '小红出发 6 分钟后追上小明。',
  },
  {
    question:
      '弟弟以每分钟 50 米的速度从学校出发回家。10 分钟后，哥哥以每分钟 70 米的速度也从学校出发去追弟弟。哥哥出发几分钟后追上弟弟？',
    steps: ['哥哥出发时，弟弟已经领先：50×10＝500（米）', '哥哥每分钟多走：70−50＝20（米）', '追及时间：500÷20＝25（分钟）'],
    answer: '哥哥出发 25 分钟后追上弟弟。',
  },
  {
    question:
      '小明每分钟走 55 米，小红每分钟走 75 米。两人从同一地点同向而行，小明先走了一段路，小红才出发去追。小红出发 8 分钟后追上小明。小红出发时，小明领先多少米？',
    steps: ['小红每分钟多走：75−55＝20（米）', '8 分钟一共多走：20×8＝160（米），这正好是小明领先的路程'],
    answer: '小红出发时，小明领先 160 米。',
  },
]

function ProblemCard({ no, p, color }: { no: number; p: Problem; color: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="sticker-sm rounded-2xl bg-white p-4 sm:p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-9 h-9 rounded-full border-2 border-[#1c1c1c] flex items-center justify-center font-extrabold text-white"
          style={{ backgroundColor: color }}
        >
          {no}
        </span>
        <p className="font-bold leading-relaxed text-[15px] sm:text-base">{p.question}</p>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="press sticker-sm mt-4 self-start rounded-full px-5 min-h-[44px] text-sm font-extrabold bg-[#fde21f]"
      >
        {open ? '收起解析 ▲' : '做完点我对答案 ▼'}
      </button>
      {open && (
        <div className="unfold mt-3 rounded-xl border-2 border-dashed border-[#1c1c1c] bg-[#fff8e1] p-4">
          <div className="text-sm font-extrabold mb-2">分步算一算：</div>
          <ol className="space-y-1.5">
            {p.steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm sm:text-[15px] font-semibold leading-relaxed">
                <span className="shrink-0 font-extrabold" style={{ color }}>{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 font-extrabold text-[15px] sm:text-base" style={{ color }}>
            答：{p.answer}
          </div>
        </div>
      )}
    </div>
  )
}

export function PracticeGroup({ title, subtitle, problems, color }: { title: string; subtitle: string; problems: Problem[]; color: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4 flex-wrap">
        <h3 className="text-xl sm:text-2xl font-black">{title}</h3>
        <span className="text-sm font-bold text-neutral-500">{subtitle}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((p, i) => (
          <ProblemCard key={i} no={i + 1} p={p} color={color} />
        ))}
      </div>
    </div>
  )
}

