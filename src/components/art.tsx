import Svg, { Circle, Defs, G, LinearGradient as SvgGradient, Path, Rect, Stop } from 'react-native-svg';

/** The little yellow wallet used on the home balance card and wallet screen. */
export function WalletGlyph({ size = 34 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <SvgGradient id="wbody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE14D" />
          <Stop offset="1" stopColor="#FFC400" />
        </SvgGradient>
      </Defs>
      <Path d="M8 12 L26 6 Q29 5 30 8 L31 12 Z" fill="#E8A800" />
      <Rect x="5" y="11" width="30" height="23" rx="6" fill="url(#wbody)" />
      <Rect x="23" y="18" width="13" height="9" rx="4.5" fill="#F2B200" />
      <Circle cx="28" cy="22.5" r="2.2" fill="#FFFFFF" />
    </Svg>
  );
}

/** Wallet + banknote + check illustration on the success screen. */
export function SuccessArt({ width = 150 }: { width?: number }) {
  return (
    <Svg width={width} height={width * 0.62} viewBox="0 0 150 93">
      <Defs>
        <SvgGradient id="blue" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7DB6FF" />
          <Stop offset="1" stopColor="#3D7CF2" />
        </SvgGradient>
        <SvgGradient id="purple" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E3B5FF" />
          <Stop offset="1" stopColor="#A766F5" />
        </SvgGradient>
      </Defs>
      {/* wallet */}
      <G transform="rotate(-8 40 55)">
        <Rect x="8" y="34" width="60" height="44" rx="10" fill="url(#blue)" />
        <Rect x="44" y="46" width="28" height="18" rx="9" fill="#2F66D6" />
        <Circle cx="54" cy="55" r="4" fill="#FFFFFF" />
      </G>
      {/* banknote */}
      <G transform="rotate(-14 100 40)">
        <Rect x="74" y="22" width="58" height="34" rx="7" fill="url(#purple)" />
        <Circle cx="103" cy="39" r="9" fill="#FFFFFF" opacity={0.85} />
        <Circle cx="103" cy="39" r="4" fill="#B67AF7" />
      </G>
      {/* check */}
      <Circle cx="132" cy="58" r="11" fill="#9B5CF6" />
      <Path d="M126.5 58.5 L130.5 62.5 L137.5 54.5" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* sparkles */}
      <Path d="M86 6 L88 13 M80 12 L85 16 M94 4 L93 11" stroke="#7DB6FF" strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M140 22 L140 30 M136 26 L144 26" stroke="#B67AF7" strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}
