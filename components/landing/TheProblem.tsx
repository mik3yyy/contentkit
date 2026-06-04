export default function TheProblem() {
  return (
    <section className="bg-[#eeecea] py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="inline-flex items-center border border-gray-300 bg-white/50 rounded-full px-4 py-1 mb-10">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">The Problem</span>
        </div>
        <h2 className="font-black leading-[0.93] tracking-tight text-black" style={{ fontSize: "clamp(40px,5.5vw,68px)" }}>
          Creating content is the bottleneck.
        </h2>
        <p className="font-light italic leading-[1.05] tracking-tight text-gray-300 mb-16" style={{ fontSize: "clamp(40px,5.5vw,68px)" }}>
          Three reasons why.
        </p>

        {/* Mockup cards */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex gap-1.5 mb-4">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-200" />)}
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Editing</span>
              <span className="text-[11px] font-mono font-semibold text-gray-600">03:47:21</span>
            </div>
            {[["V1","38%","22%","28%"],["V2","28%","42%","18%"],["A1","62%","24%",""],["A2","46%","32%",""]].map(([label, a, b, c]) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-gray-400 w-4">{label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden flex gap-0.5 p-0.5">
                  <div className="bg-gray-700 rounded-sm" style={{ width: a }} />
                  <div className="bg-gray-500 rounded-sm" style={{ width: b }} />
                  {c && <div className="bg-gray-400 rounded-sm" style={{ width: c }} />}
                </div>
              </div>
            ))}
          </div>
          {/* Posting streak */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Posting Streak</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Broken</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {[true,true,true,true,true,false,false,true,true,false,false,false,false,false].map((on, i) => (
                <div key={i} className={`h-8 rounded-md ${on ? "bg-black" : "bg-gray-100"}`} />
              ))}
            </div>
          </div>
          {/* Camera off */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Front Camera · 9:16</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Off</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center">
              <div className="relative">
                <svg width="44" height="44" fill="none" stroke="#9ca3af" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-0.5 bg-red-400 rotate-45 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text columns */}
        <div className="grid grid-cols-3 gap-12 border-t border-gray-200 pt-12">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">01</p>
            <h3 className="text-[19px] font-bold text-black mb-3">Filming takes hours.</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">Creating your own faceless content means <strong className="text-gray-700 font-semibold">sourcing footage, editing, and captioning every single post</strong>. That&apos;s three hours of work per clip — before you&apos;ve even hit publish.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">02</p>
            <h3 className="text-[19px] font-bold text-black mb-3">Consistency kills most pages.</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">Without a ready supply of content, <strong className="text-gray-700 font-semibold">you&apos;re always starting from scratch</strong>. Most creators quit because there&apos;s nothing ready when it&apos;s time to post.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">03</p>
            <h3 className="text-[19px] font-bold text-black mb-3">You don&apos;t want to be on camera.</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed"><strong className="text-gray-700 font-semibold">Privacy, day job, family</strong> — most creators don&apos;t want their face online. Faceless is the answer, but only if you&apos;ve got content ready.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
