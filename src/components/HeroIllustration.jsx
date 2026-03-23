const HeroIllustration = () => (
  <div className="relative w-full select-none pointer-events-none" aria-hidden="true">
    {/* Outer glow */}
    <div className="absolute inset-0 bg-orange-300 opacity-20 blur-3xl rounded-3xl" />

    {/* Main dashboard card */}
    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-2xl">

      {/* Laptop browser bar */}
      <div className="flex items-center gap-2 px-5 py-3 bg-[#f1f3f5] border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
        <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
        <div className="flex-1 mx-4 bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-[11px] text-gray-400 font-mono text-center">
          links.arisewebx.com/dashboard
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* URL input row */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-400 truncate border border-gray-200">
            https://very-long-website.com/blog/article
          </div>
          <div className="bg-orange-500 rounded-lg px-4 py-2.5 text-xs font-bold text-white shrink-0">
            Create link →
          </div>
        </div>

        {/* Result link */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs font-mono text-orange-500 font-semibold">links.arisewebx.com/myblog</span>
          <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 rounded px-2 py-0.5">Copy</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Clicks", value: "284", color: "text-gray-900" },
            { label: "Countries", value: "8", color: "text-blue-500" },
            { label: "Mobile", value: "62%", color: "text-orange-500" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-1">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] text-gray-400 mb-3">Clicks over time</p>
          <div className="flex items-end gap-1 h-12">
            {[30, 45, 38, 60, 55, 72, 65, 88, 75, 92, 80, 96].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-orange-400 rounded-sm"
                style={{ height: `${h}%`, opacity: 0.3 + (i / 12) * 0.7 }}
              />
            ))}
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Device tracking
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Location data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Browser info
          </span>
        </div>

      </div>

      {/* Footer brand strip */}
      <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">AriseLinkX</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">links.arisewebx.com</span>
      </div>

      {/* Tablet home bar */}
      <div className="flex justify-center py-2 bg-white">
        <div className="w-20 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>

    {/* Floating badge — top right */}
    <div className="absolute -top-3 -right-3 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] text-gray-400">QR Generated</p>
      <p className="text-sm font-bold text-green-500">✓ Ready</p>
    </div>

    {/* Floating badge — bottom left */}
    <div className="absolute -bottom-3 -left-3 bg-white border border-orange-200 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] text-gray-400">Live tracking</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <p className="text-xs font-bold text-orange-500">Active now</p>
      </div>
    </div>
  </div>
);

export default HeroIllustration;
