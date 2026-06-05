export default function LibraryLoading() {
  return (
    <div className="max-w-[1300px] mx-auto px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="shimmer h-9 w-[440px] max-w-full rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-100 pb-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="shimmer h-4 rounded" style={{ width: `${48 + (i % 3) * 14}px` }} />
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shimmer h-8 rounded-lg" style={{ width: `${56 + (i % 4) * 12}px` }} />
        ))}
      </div>

      {/* "LOADING LIBRARY" */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Loading library</p>

      {/* Shimmer grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i}>
            <div className="shimmer rounded-xl mb-2" style={{ aspectRatio: "9/16" }} />
            <div className="shimmer h-3 rounded w-4/5 mb-1.5" />
            <div className="shimmer h-2.5 rounded w-2/5" />
          </div>
        ))}
      </div>

    </div>
  )
}
