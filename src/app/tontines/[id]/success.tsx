import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SuccessArt } from '@/components/art';
import { Button, haptic, Screen, T } from '@/components/ui';
import { formatFcfa, type TxMethod } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function Success() {
  const { id, ref, method = 'momo' } = useLocalSearchParams<{ id: string; ref: string; method?: TxMethod }>();
  const { getTontine } = useStore();
  const insets = useSafeAreaInsets();
  const tontine = getTontine(id);

  useEffect(() => {
    haptic('success');
  }, []);

  if (!tontine) return null;

  const now = new Date();
  const rows: [string, string][] = [
    ['Référence', ref],
    ['Payé avec', method === 'momo' ? 'MTN MoMo · 21' : 'Orange Money · 48'],
    [
      'Date',
      `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleDateString('fr-FR', { month: 'short' })} ${now.getFullYear()} · ${now
        .toTimeString()
        .slice(0, 5)}`,
    ],
    ['Tour', `${tontine.tour} sur ${tontine.totalTours}`],
  ];

  return (
    <Screen>
      <View className="flex-1 px-6" style={{ paddingBottom: insets.bottom + 12 }}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={{ alignItems: 'center', marginTop: 56 }}>
          <SuccessArt width={170} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <T className="mt-6 text-center font-semibold text-[26px] tracking-tight">Cotisation réussie !</T>
          <T className="mt-2 text-center text-[12px] leading-[18px] text-muted">
            Votre cotisation de {formatFcfa(tontine.amount)} Fcfa pour la{'\n'}
            {tontine.name} a bien été reçue.
          </T>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(450)}>
          <View className="mt-6 gap-3 rounded-3xl bg-white p-5">
            {rows.map(([k, v]) => (
              <View key={k} className="flex-row justify-between">
                <T className="text-[11px] text-muted">{k}</T>
                <T className="text-[11px]">{v}</T>
              </View>
            ))}
          </View>
        </Animated.View>

        <View className="flex-1" />
        <Button
          label="Voir le tour"
          onPress={() => {
            router.dismissTo(`/tontines/${tontine.id}`);
            router.push({ pathname: '/tontines/[id]/tour', params: { id: tontine.id, celebrate: '1' } });
          }}
        />
        <Button label="Aller à l’accueil" variant="ghost" onPress={() => router.dismissTo('/')} />
      </View>
    </Screen>
  );
}
