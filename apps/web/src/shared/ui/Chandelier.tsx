/**
 * Lustre em estrela (inspirado nos lustres modernistas dos teatros de ópera
 * dos anos 60): hastes finas irradiando de um núcleo, com cristais nas pontas.
 */
export function Chandelier({ size = 48, className = '', rays = 24 }: { size?: number; className?: string; rays?: number }) {
  const c = 50;
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2;
    const long = i % 2 === 0;
    const r = long ? 46 : 32;
    return { x: c + Math.cos(a) * r, y: c + Math.sin(a) * r, x0: c + Math.cos(a) * 9, y0: c + Math.sin(a) * 9, long };
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6dc" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#e7cd8f" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e7cd8f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r={30} fill="url(#glow)" />
      {lines.map((l, i) => (
        <g key={i}>
          <line x1={l.x0} y1={l.y0} x2={l.x} y2={l.y} stroke="currentColor" strokeWidth={l.long ? 0.9 : 0.6} strokeLinecap="round" />
          <circle cx={l.x} cy={l.y} r={l.long ? 1.9 : 1.3} fill="currentColor" />
        </g>
      ))}
      <circle cx={c} cy={c} r={6} fill="currentColor" />
      <circle cx={c} cy={c} r={2.4} fill="#fff6dc" />
    </svg>
  );
}
