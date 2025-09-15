

export default function SailingLoaderComponent({
  imageSrc = "/image.png",
  size = "w-80 h-48",
  alt = "Preview image",
}: {
  imageSrc?: string;
  size?: string;
  alt?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-blue-100 p-6">
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center">
        <div className={`mx-auto rounded-lg overflow-hidden flex items-center justify-center ${size}`}>
          <img src={imageSrc} alt={alt} className="object-contain w-full h-full" />
        </div>
        <div className="mt-5 w-full">
          <p className="text-center text-sm text-slate-600 mb-3">Loading preview...</p>
          <div className="relative h-24 flex items-end justify-center">
            <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
              <svg viewBox="0 0 120 28" preserveAspectRatio="none" className="w-full h-full block">
                <defs>
                  <linearGradient id="waveGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#DBEAFE" />
                    <stop offset="100%" stopColor="#BFDBFE" />
                  </linearGradient>
                </defs>
                <path fill="url(#waveGrad)" d="M0 20 Q 20 10 40 20 T 80 20 T 120 20 V30 H0 Z" />
              </svg>
            </div>
            <div className="sail-wrap absolute bottom-5 flex items-end justify-center">
              <div className="sailboat flex flex-col items-center">
                <svg width="64" height="64" viewBox="0 0 64 64" className="block">
                  <g transform="translate(0,4)">
                    <path d="M8 44 Q32 54 56 44 Q40 56 8 44" fill="#1E3A8A" />
                    <rect x="31" y="6" width="2" height="32" fill="#374151" />
                    <path d="M33 8 L48 26 L33 26 Z" fill="#60A5FA" />
                  </g>
                </svg>
                <div className="w-16 h-1 rounded-full bg-black/10 mt-2" />
              </div>
            </div>
            <div className="sr-only" aria-live="polite">Content is loading</div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes sail-horizontal {
          0% { transform: translateX(-40%); }
          50% { transform: translateX(40%); }
          100% { transform: translateX(-40%); }
        }
        @keyframes bob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes shadow-scale {
          0% { transform: scaleX(1) translateY(0); opacity: 0.18; }
          50% { transform: scaleX(0.9) translateY(2px); opacity: 0.25; }
          100% { transform: scaleX(1) translateY(0); opacity: 0.18; }
        }
        .sail-wrap { animation: sail-horizontal 4s ease-in-out infinite; }
        .sailboat { animation: bob 2s ease-in-out infinite; }
        .sailboat + div, .sailboat > div {
          animation: shadow-scale 2s ease-in-out infinite;
        }
        @media (max-width: 420px) {
          .sail-wrap svg { width: 48px; height: 48px; }
        }
      `}</style>
    </div>
  );
}
