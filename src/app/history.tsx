import { MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { TxRow } from '@/components/tx-row';
import { Header, IconButton, Screen, SegmentedTabs, T } from '@/components/ui';
import { useStore } from '@/lib/store';

type Filter = 'all' | 'success' | 'cancelled';

export default function History() {
  const { transactions } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const list = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter);

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
        <T className="mt-4 font-semibold text-[30px] tracking-tight">Historique</T>
        <View className="mt-5">
          <SegmentedTabs
            tabs={[
              { key: 'all', label: 'Tout' },
              { key: 'success', label: 'Réussies' },
              { key: 'cancelled', label: 'Annulées' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </View>
        <View className="mt-2">
          {list.map((tx, i) => (
            // Keyed by filter too so rows re-animate when the tab changes.
            <Animated.View key={`${filter}-${tx.id}`} entering={FadeInDown.delay(i * 60).duration(350)}>
              <TxRow tx={tx} />
            </Animated.View>
          ))}
          {list.length === 0 && <T className="mt-10 text-center text-[12px] text-muted">Aucune opération</T>}
        </View>
      </ScrollView>
    </Screen>
  );
}
