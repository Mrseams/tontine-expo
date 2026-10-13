import { View } from 'react-native';

import { formatFcfa, members, type Tontine } from '@/lib/data';
import { Avatar, iridescent, LinearGradient, T } from './ui';

/** Four overlapping portraits of different sizes, as on the home carousel. */
function AvatarCluster({ ids }: { ids: string[] }) {
  const [a, b, c, d] = ids.map((id) => members[id].avatar);
  const ring = 'absolute rounded-full border-[3px] border-white';
  return (
    <View className="h-[120px] w-[130px]">
      <View className={ring} style={{ left: 0, top: 18 }}>
        <Avatar uri={a} size={58} />
      </View>
      <View className={ring} style={{ right: 6, top: 0 }}>
        <Avatar uri={b} size={44} />
      </View>
      <View className={ring} style={{ left: 8, bottom: 6 }}>
        <Avatar uri={c} size={40} />
      </View>
      <View className={`${ring} z-10`} style={{ left: 40, top: 30 }}>
        <Avatar uri={d} size={72} />
      </View>
    </View>
  );
}

export function TontineCard({ tontine, width }: { tontine: Tontine; width: number }) {
  // Show the current beneficiary in the large slot.
  const current = tontine.memberIds[tontine.tour - 1];
  const others = tontine.memberIds.filter((id) => id !== current).slice(0, 3);
  return (
    <View style={{ width }} className="h-[230px] overflow-hidden rounded-[28px] bg-white">
      <LinearGradient
        colors={iridescent('CC')}
        locations={[0, 0.35, 0.55, 0.7, 0.85, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        className="absolute inset-0"
      />
      <View className="flex-1 items-center pt-4">
        <AvatarCluster ids={[...others, current]} />
        <T className="mt-3 text-[11px] text-muted">
          Tour {tontine.tour}/{tontine.totalTours}
        </T>
        <T className="mt-0.5 font-semibold text-[16px]">{tontine.name}</T>
        <T className="mt-2 text-[10px] text-ink/70">
          {formatFcfa(tontine.amount)} Fcfa<T className="text-[10px] text-muted">/{tontine.period}</T>
        </T>
      </View>
    </View>
  );
}
