import { Image, type ImageSource } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useEffect, useState, type ReactNode } from 'react';
import { Platform, Pressable, Text, View, type PressableProps, type TextProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

cssInterop(LinearGradient, { className: 'style' });
cssInterop(Image, { className: 'style' });

export { Image, LinearGradient };

/** Pastel "oil slick" palette used across cards and headers. */
export const IRIDESCENT = ['#FBD3E9', '#D9CCFF', '#BFE3FF', '#C8F5E4', '#FFE7C2'] as const;

/** Iridescent stops at the given hex alpha, fading in from transparent white. */
export function iridescent(alphaHex: string, tail: string[] = []) {
  return ['rgba(255,255,255,0)', ...IRIDESCENT.map((c) => c + alphaHex), ...tail] as [string, string, ...string[]];
}

export function haptic(kind: 'light' | 'medium' | 'success' = 'light') {
  if (Platform.OS === 'web') return;
  if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

/** Soft iridescent glow behind the status bar, present on every screen. */
export function TopGlow() {
  return (
    <View pointerEvents="none" className="absolute left-0 right-0 top-0 h-56">
      <LinearGradient
        colors={['rgba(251,211,233,0.75)', 'rgba(217,204,255,0.55)', 'rgba(191,227,255,0.45)', 'rgba(200,245,228,0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={['rgba(244,244,246,0)', 'rgba(244,244,246,0.6)', '#F4F4F6']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
      />
    </View>
  );
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View className={`flex-1 bg-canvas ${className}`} style={{ paddingTop: insets.top }}>
      <TopGlow />
      {children}
    </View>
  );
}

export function T({ className = '', ...props }: TextProps & { className?: string }) {
  return <Text className={`font-medium text-ink ${className}`} {...props} />;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable that springs down slightly on touch, with a light haptic. */
export function Tap({
  children,
  className = '',
  scaleTo = 0.97,
  onPress,
  ...props
}: PressableProps & { className?: string; scaleTo?: number; children: ReactNode }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...props}
      onPressIn={() => scale.set(withSpring(scaleTo, { damping: 20, stiffness: 400 }))}
      onPressOut={() => scale.set(withSpring(1, { damping: 14, stiffness: 300 }))}
      onPress={(e) => {
        haptic();
        onPress?.(e);
      }}
      style={style}
    >
      <View className={className}>{children}</View>
    </AnimatedPressable>
  );
}

export function IconButton({ children, onPress, className = '' }: { children: ReactNode; onPress?: () => void; className?: string }) {
  return (
    <Tap onPress={onPress} scaleTo={0.9} className={`h-10 w-10 items-center justify-center rounded-full bg-white/80 ${className}`}>
      {children}
    </Tap>
  );
}

export function Header({ right }: { right?: ReactNode }) {
  return (
    <View className="h-14 flex-row items-center justify-between px-5">
      <IconButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
        <ChevronLeft size={20} color="#0B0B0F" />
      </IconButton>
      {right}
    </View>
  );
}

export function Button({ label, onPress, variant = 'dark', disabled }: { label: string; onPress?: () => void; variant?: 'dark' | 'ghost'; disabled?: boolean }) {
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      className={`h-14 items-center justify-center rounded-full ${variant === 'dark' ? 'bg-ink' : ''} ${disabled ? 'opacity-60' : ''}`}
    >
      <T className={`text-[15px] ${variant === 'dark' ? 'text-white' : 'text-ink'}`}>{label}</T>
    </Tap>
  );
}

export function Avatar({ uri, size = 40, className = '' }: { uri: ImageSource; size?: number; className?: string }) {
  return (
    <Image
      source={uri}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={className}
      contentFit="cover"
      transition={200}
    />
  );
}

export function AvatarStack({ uris, size = 26 }: { uris: ImageSource[]; size?: number }) {
  return (
    <View className="flex-row">
      {uris.map((uri, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.3, zIndex: uris.length - i }} className="rounded-full border-2 border-white">
          <Avatar uri={uri} size={size} />
        </View>
      ))}
    </View>
  );
}

/** Mobile-money logos rendered as coloured roundels. */
export function MethodBadge({ method, size = 36 }: { method: 'momo' | 'om'; size?: number }) {
  if (method === 'om') {
    return (
      <View style={{ width: size, height: size }} className="items-center justify-center rounded-lg bg-white">
        <View style={{ width: size * 0.6, height: size * 0.6 }} className="items-center justify-end rounded-[4px] bg-black pb-[2px]">
          <View style={{ width: size * 0.42, height: size * 0.12 }} className="bg-[#FF7900]" />
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center rounded-full bg-momo">
      <Text style={{ fontSize: size * 0.24 }} className="font-bold text-[#004F71]">
        MoMo
      </Text>
    </View>
  );
}

/** Counts up to `value` with an ease-out curve whenever it changes. */
export function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const from = display;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
}

export function SegmentedTabs<K extends string>({ tabs, value, onChange }: { tabs: { key: K; label: string }[]; value: K; onChange: (k: K) => void }) {
  return (
    <View className="flex-row gap-6 border-b border-line">
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              haptic();
              onChange(tab.key);
            }}
            className="pb-3"
          >
            <T className={`text-[13px] ${active ? 'text-ink' : 'text-muted'}`}>{tab.label}</T>
            {active && <View className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-ink" />}
          </Pressable>
        );
      })}
    </View>
  );
}
