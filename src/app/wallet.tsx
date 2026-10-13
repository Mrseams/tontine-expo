import { router } from 'expo-router';
import { MoreHorizontal } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { WalletGlyph } from '@/components/art';
import { TxRow } from '@/components/tx-row';
import { Header, IconButton, iridescent, LinearGradient, Screen, T, Tap, useCountUp } from '@/components/ui';
import { formatFcfa } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function Wallet() {
  const { balance, transactions } = useStore();
  const shown = useCountUp(balance, 1200);
  const recent = transactions.filter((t) => t.status === 'success').slice(0, 3);

  return (
    <Screen>
      <Header
        right={
          <IconButton>
            <MoreHorizontal size={18} color="#0B0B0F" />
          </IconButton>
        }
      />
      <ScrollView contentContainerClassName="px-5 pb-12">
        <T className="mt-4 font-semibold text-[30px] tracking-tight">Mon portefeuille</T>

        <Animated.View entering={FadeInDown.duration(500)}>
          <View className="mt-5 h-[150px] overflow-hidden rounded-3xl bg-white p-5">
            <LinearGradient
              colors={iridescent('E6', ['rgba(255,255,255,0.4)'])}
              locations={[0.05, 0.3, 0.45, 0.6, 0.72, 0.85, 1]}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 0.8 }}
              className="absolute inset-0"
            />
            <WalletGlyph size={30} />
            <View className="flex-1" />
            <View className="flex-row items-end justify-between">
              <View>
                <T className="text-[10px] text-ink/60">Solde disponible</T>
                <T className="font-semibold text-[30px] leading-[34px] tracking-tight">
                  {formatFcfa(shown)}
                  <T className="text-[13px] text-muted">Fcfa</T>
                </T>
              </View>
              <Tap className="rounded-full bg-white px-4 py-2">
                <T className="text-[11px]">Retirer</T>
              </Tap>
            </View>
          </View>
        </Animated.View>

        <View className="mt-6 flex-row items-center justify-between">
          <T className="text-[12px] text-ink/80">Récent</T>
          <Tap onPress={() => router.push('/history')}>
            <T className="text-[12px] text-ink/70">Voir tout</T>
          </Tap>
        </View>
        {recent.map((tx, i) => (
          <Animated.View key={tx.id} entering={FadeInDown.delay(250 + i * 90).springify().damping(18)}>
            <TxRow tx={tx} />
          </Animated.View>
        ))}
      </ScrollView>
    </Screen>
  );
}
