import { ChevronDown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatFcfa, type Tontine, type TxMethod } from '@/lib/data';
import { Button, haptic, MethodBadge, T, useCountUp } from './ui';

const METHODS: Record<TxMethod, { label: string; number: string }> = {
  momo: { label: 'MTN Mobile Money', number: '+237 6•• •• •• 21' },
  om: { label: 'Orange Money', number: '+237 69• •• •• 48' },
};

export function CotiserSheet({
  tontine,
  open,
  onClose,
  onConfirm,
}: {
  tontine: Tontine;
  open: boolean;
  onClose: () => void;
  onConfirm: (method: TxMethod) => void;
}) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<TxMethod>('momo');
  const y = useSharedValue(600);
  const amount = useCountUp(open ? tontine.amount : 0, 700);

  useEffect(() => {
    y.set(open ? withSpring(0, { damping: 22, stiffness: 220 }) : withTiming(600, { duration: 260, easing: Easing.in(Easing.cubic) }));
  }, [open, y]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  // Stays mounted so the close animation can play; it only takes touches while open.
  return (
    <View className="absolute inset-0 justify-end" pointerEvents={open ? 'auto' : 'none'}>
      {open && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ position: 'absolute', inset: 0 }}>
          <Pressable className="flex-1 bg-black/25" onPress={onClose} />
        </Animated.View>
      )}
      <Animated.View style={sheetStyle}>
        <View className="rounded-t-[32px] bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
          <View className="h-1 w-10 self-center rounded-full bg-line" />
          <T className="mt-4 text-center font-semibold text-[17px]">Cotiser</T>

          <View className="mt-5 items-center rounded-3xl bg-canvas py-5">
            <T className="font-semibold text-[32px] tracking-tight">
              {formatFcfa(amount)}
              <T className="text-[15px] text-muted">Fcfa</T>
            </T>
            <T className="mt-1 text-[12px] text-ink/70">{tontine.name}</T>
          </View>

          <T className="mt-5 text-[12px] text-ink/70">Payer avec</T>
          <Pressable
            onPress={() => {
              haptic();
              setMethod((m) => (m === 'momo' ? 'om' : 'momo'));
            }}
            className="mt-2 flex-row items-center gap-3 rounded-2xl border border-line px-3 py-3"
          >
            <MethodBadge method={method} size={34} />
            <View className="flex-1">
              <T className="text-[13px]">{METHODS[method].label}</T>
              <T className="text-[11px] text-muted">{METHODS[method].number}</T>
            </View>
            <ChevronDown size={16} color="#8E8E96" />
          </Pressable>

          <View className="mt-6">
            <Button label="Confirmer" onPress={() => onConfirm(method)} />
          </View>
          <Button label="Retour" variant="ghost" onPress={onClose} />
        </View>
      </Animated.View>
    </View>
  );
}
