import { useLocalSearchParams } from 'expo-router';
import type { ImageSource } from 'expo-image';
import { Check, ChevronDown, ChevronRight, Lock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Avatar, Header, haptic, Screen, T, Tap } from '@/components/ui';
import { ME, members, tourDate } from '@/lib/data';
import { useStore } from '@/lib/store';

const AVATAR = 46;

function MemberDot({ uri, paid, celebrate, index }: { uri: ImageSource; paid: boolean; celebrate: boolean; index: number }) {
  return (
    <Animated.View entering={FadeIn.delay(120 + index * 35)}>
      <View style={{ width: AVATAR, height: AVATAR }}>
        <Avatar uri={uri} size={AVATAR} />
        <View className={`absolute inset-0 items-center justify-center rounded-full ${paid ? 'bg-black/35' : 'bg-white/55'}`}>
          {paid ? (
            <Animated.View entering={celebrate ? ZoomIn.delay(450).springify().damping(9) : undefined}>
              <Check size={18} color="#fff" strokeWidth={3} />
            </Animated.View>
          ) : (
            <Lock size={14} color="#0B0B0F" />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default function TourDetails() {
  const { id, celebrate } = useLocalSearchParams<{ id: string; celebrate?: string }>();
  const { getTontine } = useStore();
  const [expanded, setExpanded] = useState(false);
  const tontine = getTontine(id);

  useEffect(() => {
    if (celebrate) {
      const t = setTimeout(() => haptic('success'), 550);
      return () => clearTimeout(t);
    }
  }, [celebrate]);

  if (!tontine) return null;
  const date = tourDate(tontine, tontine.tour);
  const visible = expanded ? tontine.memberIds : tontine.memberIds.slice(0, 8);

  return (
    <Screen>
      <Header />
      <ScrollView contentContainerClassName="px-5 pb-12">
        <T className="mt-4 font-semibold text-[30px] tracking-tight">Détails</T>

        <Animated.View entering={FadeInDown.duration(450)}>
          <T className="mt-6 font-semibold text-[44px] leading-[48px] tracking-tight">{date.day}</T>
          <T className="font-semibold text-[20px]">{date.month}</T>
          <View className="flex-row justify-between">
            <T className="text-[13px] text-muted">{date.year}</T>
            <T className="text-[12px] text-muted">{date.weekday}</T>
          </View>
        </Animated.View>

        <View className="mt-5 flex-row flex-wrap" style={{ gap: 10 }}>
          {visible.map((memberId, i) => (
            <MemberDot
              key={memberId}
              index={i}
              uri={members[memberId].avatar}
              paid={tontine.paid[memberId] !== undefined}
              celebrate={!!celebrate && memberId === ME}
            />
          ))}
        </View>
        <Tap className="mt-4 flex-row items-center self-start" onPress={() => setExpanded((e) => !e)}>
          <T className="text-[11px] text-ink/70">{expanded ? 'Moins' : 'Plus'}</T>
          {expanded ? <ChevronDown size={12} color="#0B0B0F" /> : <ChevronRight size={12} color="#0B0B0F" />}
        </Tap>

        <T className="mb-3 mt-8 text-[12px] text-ink/80">Programme de la tontine</T>
        <View className="gap-2">
          {tontine.memberIds.map((memberId, i) => {
            const m = members[memberId];
            const d = tourDate(tontine, i + 1);
            const done = i < tontine.tour - 1;
            const current = i === tontine.tour - 1;
            return (
              <Animated.View key={memberId} entering={FadeInDown.delay(200 + i * 40)}>
                <View className={`flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3 ${current ? 'border border-orange/50' : ''}`}>
                  <View className="w-8 items-center">
                    <T className="font-semibold text-[13px]">{d.day}</T>
                    <T className="text-[9px] text-muted">{d.monthShort}</T>
                  </View>
                  <Avatar uri={m.avatar} size={30} />
                  <View className="flex-1">
                    <T className="text-[13px]">
                      {m.firstName} {m.lastName}
                    </T>
                    <T className="text-[10px] text-muted">{current ? 'Bénéficiaire du tour' : m.role}</T>
                  </View>
                  {done ? (
                    <View className="h-5 w-5 items-center justify-center rounded-full bg-ink/60">
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </View>
                  ) : current ? (
                    <View className="h-2.5 w-2.5 rounded-full bg-orange" />
                  ) : (
                    <Lock size={14} color="#8E8E96" />
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
