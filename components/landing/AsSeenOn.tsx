export default function AsSeenOn() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-[1000px] mx-auto px-6">
        <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-10">As Seen On</p>
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <span className="text-[20px] font-black text-gray-300 tracking-tight">INDEPENDENT</span>
          <span className="text-[20px] font-black text-gray-300 tracking-tight">DAILY EXPRESS</span>
          <span className="text-[22px] font-bold text-gray-300 tracking-tight">shopify</span>
          <span className="text-[26px] font-light text-gray-300" style={{ fontFamily: "Georgia,serif" }}>Etsy</span>
          <span className="text-[22px] font-black text-gray-300" style={{ fontFamily: "Georgia,serif" }}>Forbes</span>
        </div>
      </div>
    </section>
  )
}
