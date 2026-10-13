import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronRight, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CotiserSheet } from '@/components/cotiser-sheet';
import { Avatar, Button, Header, IconButton, Screen, T, Tap, useCountUp } from '@/components/ui';
import { formatFcfa, ME, members, timeAgo, type Tontine } from '@/lib/data';
import { useStore } from '@/lib/store';

function MiniBars({ tontine, collected }: { tontine: Tontine; collected: number }) {
  const full = tontine.amount * tontine.memberIds.length;
  const values = [...tontine.history.slice(-7).map((v) => v / full), collected / full];
  return (
    <View className="h-9 flex-row items-end gap-[3px]">
      {values.map((v, i) => {
        const current = i === values.length - 1;
        return (
          <Animated.View key={i} entering={FadeInUp.delay(300 + i * 40)}>
            <View className={`w-[3px] rounded-full ${current ? 'bg-orange' : 'bg-line'}`} style={{ height: 6 + v * 30 }} />
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function TontineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTontine } = useStore();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const tontine = getTontine(id);

  const collected = tontine ? Object.keys(tontine.paid).length * tontine.amount : 0;
  const shown = useCountUp(collected, 1100);
  if (!tontine) return null;

  const beneficiary = members[tontine.memberIds[tontine.tour - 1]];
  const paid = Object.entries(tontine.paid).sort((a, b) => a[1] - b[1]);
  const pending = tontine.memberIds.filter((m) => tontine.paid[m] === undefined);
  const iPaid = tontine.paid[ME] !== undefined;

  return (
    <Screen>
      <Header
        right={
          <IconButton>
            <MessageCircle size={17} color="#0B0B0F" fill="#0B0B0F" />
          </IconButton>
        }
      />
      <ScrollView contentContainerClassName="px-5" contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <T className="mt-4 font-semibold text-[30px] tracking-tight">{tontine.name}</T>

        <Animated.View entering={FadeInDown.duration(450)}>
          <View className="mt-5 rounded-3xl bg-white p-5">
            <View className="flex-row justify-between">
              <T className="text-[12px] text-ink/80">Total collecté</T>
              <T className="text-[10px] text-muted">
                Fin du tour dans <T className="text-[10px]">{tontine.endsInDays} jours</T>
              </T>
            </View>
            <View className="mt-4 flex-row items-end justify-between">
              <T className="font-semibold text-[36px] leading-[40px] tracking-tight">
                {formatFcfa(shown)}
                <T className="text-[13px] text-muted">Fcfa</T>
              </T>
              <MiniBars tontine={tontine} collected={collected} />
            </View>
            <Tap className="mt-4 flex-row items-center self-start" onPress={() => router.push(`/tontines/${tontine.id}/tour`)}>
              <T className="text-[12px]">Détails</T>
              <ChevronRight size={13} color="#0B0B0F" />
            </Tap>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)}>
          <Tap className="mt-3 flex-row items-center justify-between rounded-3xl bg-white p-5" onPress={() => router.push(`/tontines/${tontine.id}/tour`)}>
            <View>
              <T className="text-[10px] text-muted">Prochain bénéficiaire</T>
              <View className="mt-2 flex-row items-center gap-2">
                <Avatar uri={beneficiary.avatar} size={22} />
                <T className="text-[14px]">
                  {beneficiary.firstName} {beneficiary.lastName}
                </T>
              </View>
            </View>
            <ChevronRight size={18} color="#0B0B0F" />
          </Tap>
        </Animated.View>

        <T className="mb-1 mt-6 text-[12px] text-ink/80">Tous les tontineurs</T>
        {paid.map(([memberId, minutes], i) => {
          const m = members[memberId];
          return (
            <Animated.View key={memberId} entering={FadeInDown.delay(160 + i * 50)}>
              <View className="flex-row items-center gap-3 py-2.5">
                <Avatar uri={m.avatar} size={38} />
                <View className="flex-1">
                  <T className="text-[13px]">
                    {m.firstName} {m.lastName}
                    {memberId === ME ? ' (vous)' : ''}
                  </T>
                  <T className="text-[10px] text-muted">{m.role}</T>
                </View>
                <View className="flex-row items-center gap-1">
                  <Check size={12} color="#1FA25A" />
                  <T className="text-[11px] text-muted">{timeAgo(minutes)}</T>
                </View>
              </View>
            </Animated.View>
          );
        })}
        {pending.map((memberId) => {
          const m = members[memberId];
          return (
            <View key={memberId} className="flex-row items-center gap-3 py-2.5 opacity-50">
              <Avatar uri={m.avatar} size={38} />
              <View className="flex-1">
                <T className="text-[13px]">
                  {m.firstName} {m.lastName}
                  {memberId === ME ? ' (vous)' : ''}
                </T>
                <T className="text-[10px] text-muted">{m.role}</T>
              </View>
              <T className="text-[11px] text-muted">En attente</T>
            </View>
          );
        })}
      </ScrollView>

      <View className="absolute left-5 right-5" style={{ bottom: insets.bottom + 16 }}>
        <Button label={iPaid ? 'Vous avez cotisé ce tour ✓' : 'Cotiser maintenant'} disabled={iPaid} onPress={() => setSheetOpen(true)} />
      </View>

      <CotiserSheet
        tontine={tontine}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={(method) => {
          setSheetOpen(false);
          router.push({ pathname: '/tontines/[id]/validate', params: { id: tontine.id, method } });
        }}
      />
    </Screen>
  );
}
