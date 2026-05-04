const CARDS = [
  {
    id: 'moon',
    symbol: '☽',
    name: '달',
    floatClass: 'float-left',
    left: 8 as number | string,
    top: 32,
    right: undefined as number | undefined,
    zIndex: 1,
    symbolColor: '#c8b8f0',
    glow: 'rgba(139,107,181,0.6)',
    border: 'linear-gradient(150deg, #9b6dd0 0%, #c9956c 55%, #7c6bad 100%)',
    scale: undefined as number | undefined,
  },
  {
    id: 'heart',
    symbol: '♡',
    name: '연인',
    floatClass: 'float-center',
    left: 'calc(50% - 52px)' as number | string,
    top: 8,
    right: undefined,
    zIndex: 3,
    symbolColor: '#e0b48c',
    glow: 'rgba(201,149,108,0.65)',
    border: 'linear-gradient(135deg, #c9956c 0%, #ecdcb8 50%, #c9956c 100%)',
    scale: 1.06,
  },
  {
    id: 'star',
    symbol: '✦',
    name: '별',
    floatClass: 'float-right',
    left: undefined,
    top: 32,
    right: 8,
    zIndex: 2,
    symbolColor: '#d4af37',
    glow: 'rgba(212,175,55,0.55)',
    border: 'linear-gradient(150deg, #d4af37 0%, #b19cd9 50%, #d4af37 100%)',
    scale: undefined,
  },
];

export default function TarotHeroCards() {
  return (
    <div style={{ position: 'relative', width: '300px', height: '215px', margin: '0 auto' }}>
      {/* Ambient glow underneath */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        width: '240px',
        height: '80px',
        marginLeft: '-120px',
        background: 'radial-gradient(ellipse, rgba(107,63,160,0.22) 0%, transparent 70%)',
        filter: 'blur(16px)',
        pointerEvents: 'none',
      }} />

      {CARDS.map((card) => (
        <div
          key={card.id}
          className={`${card.floatClass} tarot-hero-card`}
          style={{
            position: 'absolute',
            left: card.left,
            right: card.right,
            top: card.top,
            zIndex: card.zIndex,
          }}
        >
          {/* Scale wrapper — separate from float animation to avoid transform conflict */}
          <div style={{ transform: card.scale ? `scale(${card.scale})` : undefined }}>
            {/* Gradient border shell */}
            <div style={{
              padding: '1.5px',
              borderRadius: '16px',
              background: card.border,
              boxShadow: `0 0 30px ${card.glow}, 0 16px 48px rgba(0,0,0,0.75)`,
            }}>
              {/* Card body */}
              <div style={{
                width: '104px',
                height: '164px',
                borderRadius: '14px',
                background: 'linear-gradient(158deg, rgba(62,18,120,0.55) 0%, rgba(8,4,18,0.97) 70%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '14px 10px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle dot grid */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(177,156,217,0.07) 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                  pointerEvents: 'none',
                }} />

                {/* Inner radial glow behind symbol */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  width: '90px',
                  height: '70px',
                  marginLeft: '-45px',
                  background: `radial-gradient(ellipse, ${card.symbolColor}28 0%, transparent 70%)`,
                  filter: 'blur(12px)',
                  pointerEvents: 'none',
                }} />

                {/* Top ornament */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '1px', background: 'rgba(212,175,55,0.55)' }} />
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(212,175,55,0.7)' }} />
                  <div style={{ width: '20px', height: '1px', background: 'rgba(212,175,55,0.55)' }} />
                </div>

                {/* Main symbol */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '42px',
                  lineHeight: 1,
                  color: card.symbolColor,
                  textShadow: `0 0 16px ${card.symbolColor}95, 0 0 36px ${card.symbolColor}45`,
                  padding: '5px 0',
                }}>
                  {card.symbol}
                </div>

                {/* Card label */}
                <p style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '9px',
                  color: 'rgba(212,197,240,0.6)',
                  letterSpacing: '0.24em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  {card.name}
                </p>

                {/* Bottom ornament */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '1px', background: 'rgba(212,175,55,0.55)' }} />
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(212,175,55,0.7)' }} />
                  <div style={{ width: '20px', height: '1px', background: 'rgba(212,175,55,0.55)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
