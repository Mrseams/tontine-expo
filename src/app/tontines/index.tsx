import { router } from 'expo-router';
import { ChevronRight, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { AvatarStack, Header, IconButton, iridescent, LinearGradient, Screen, SegmentedTabs, T, Tap } from '@/components/ui';
import { formatFcfa, ME, members } from '@/lib/data';
import { useStore } from '@/lib/store';

type Filter = 'all' | 'mine';

export default function TontinesList() {
  const { tontines } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  // "Mes tontines" = the ones the user administers.
  const list = filter === 'all' ? tontines : tontines.filter((t) => t.adminId === ME);

  return (
    <Screen>
      <Header
        right={
          <IconButton>
            <Plus size={18} color="#0B0B0F" />
          </IconButton>
        }
      />
      <ScrollView contentContainerClassName="px-5 pb-10">
        <T className="mt-4 font-semibold text-[30px] tracking-tight">Vos tontines</T>
        <View className="mt-5">
          <SegmentedTabs
            tabs={[
              { key: 'all', label: 'Toutes' },
              { key: 'mine', label: 'Mes tontines' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </View>

        <View className="mt-5 gap-3">
          {list.map((t, i) => (
            <Animated.View key={t.id} entering={FadeInDown.delay(i * 70).springify().damping(18)} layout={LinearTransition}>
              <Tap onPress={() => router.push(`/tontines/${t.id}`)} className="overflow-hidden rounded-3xl bg-white p-4">
                <LinearGradient
                  colors={iridescent('B3')}
                  locations={[0, 0.3, 0.5, 0.65, 0.8, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1.4 }}
                  className="absolute inset-0"
                />
                <View className="flex-row items-start justify-between">
                  <AvatarStack uris={t.memberIds.slice(0, t.id === 'vacances' ? 4 : 3).map((id) => members[id].avatar)} />
                  <T className="text-[10px] text-ink/70">
                    {formatFcfa(t.amount)} Fcfa<T className="text-[10px] text-muted">/{t.period}</T>
                  </T>
                </View>
                <View className="mt-4 flex-row items-end justify-between">
                  <View>
                    <T className="text-[10px] text-muted">
                      Tour {t.tour}/{t.totalTours}
                    </T>
                    <T className="mt-0.5 font-semibold text-[15px]">{t.name}</T>
                  </View>
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-white/80">
                    <ChevronRight size={14} color="#0B0B0F" />
                  </View>
                </View>
              </Tap>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
