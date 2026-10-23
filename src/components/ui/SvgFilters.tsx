export default function SvgFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="xerox" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.05 0.32 0.78 1 1" />
          <feFuncG type="discrete" tableValues="0 0.05 0.32 0.78 1 1" />
          <feFuncB type="discrete" tableValues="0 0.05 0.32 0.78 1 1" />
        </feComponentTransfer>
      </filter>
      <filter id="threshold" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0 1" />
          <feFuncG type="discrete" tableValues="0 0 1" />
          <feFuncB type="discrete" tableValues="0 0 1" />
        </feComponentTransfer>
      </filter>
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
      </filter>
    </svg>
  );
}
