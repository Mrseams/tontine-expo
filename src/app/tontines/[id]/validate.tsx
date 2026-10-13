import { router, useLocalSearchParams } from 'expo-router';
import { Hourglass, Smartphone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, MethodBadge, Screen, T } from '@/components/ui';
import { formatFcfa, type TxMethod } from '@/lib/data';
import { useStore } from '@/lib/store';

const USSD: Record<TxMethod, { name: string; code: string }> = {
  momo: { name: 'MTN MoMo', code: '*126#' },
  om: { name: 'Orange Money', code: '#150#' },
};

function PulseRing({ delay }: { delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }), -1));
  }, [delay, p]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - p.value),
    transform: [{ scale: 0.7 + p.value * 0.8 }],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: '#FFE36B' }, style]}
    />
  );
}

export default function Validate() {
  const { id, method = 'momo' } = useLocalSearchParams<{ id: string; method?: TxMethod }>();
  const { getTontine, contribute } = useStore();
  const insets = useSafeAreaInsets();
  const [secondsLeft, setSecondsLeft] = useState(105);
  const [checking, setChecking] = useState(false);
  const tontine = getTontine(id);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!tontine) return null;
  const ussd = USSD[method];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const confirm = () => {
    setChecking(true);
    // Simulates polling the operator for the payment status.
    setTimeout(() => {
      const ref = contribute(tontine.id);
      router.replace({ pathname: '/tontines/[id]/success', params: { id: tontine.id, ref, method } });
    }, 1400);
  };

  return (
    <Screen>
      <View className="flex-1 px-6" style={{ paddingBottom: insets.bottom + 12 }}>
        <View className="mt-16 items-center">
          <View className="h-[170px] w-[170px] items-center justify-center">
            <PulseRing delay={0} />
            <PulseRing delay={1100} />
            <View className="h-[120px] w-[120px] items-center justify-center rounded-full bg-momo/40">
              <View className="h-[84px] w-[84px] items-center justify-center rounded-full bg-white">
                <Smartphone size={30} color="#0B0B0F" strokeWidth={1.6} />
                <View className="absolute -bottom-1 -right-1">
                  <MethodBadge method={method} size={26} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <T className="mt-8 text-center font-semibold text-[26px] leading-[30px] tracking-tight">Validez sur votre{'\n'}téléphone</T>
          <T className="mt-3 text-center text-[12px] leading-[18px] text-muted">
            Une demande {ussd.name} s’est affichée.{'\n'}Entrez votre code PIN pour confirmer le{'\n'}paiement de {formatFcfa(tontine.amount)} Fcfa.
          </T>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(450)}>
          <View className="mt-6 flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <Hourglass size={16} color="#FF7A1A" />
            <View>
              <T className="text-[12px]">Pas de message ? Composez {ussd.code}</T>
              <T className="text-[10px] text-muted">
                {secondsLeft > 0 ? `La demande expire dans ${mm}:${ss}` : 'La demande a expiré'}
              </T>
            </View>
          </View>
        </Animated.View>

        <View className="flex-1" />
        <Button label={checking ? 'Vérification…' : 'J’ai validé le paiement'} disabled={checking || secondsLeft === 0} onPress={confirm} />
        <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
