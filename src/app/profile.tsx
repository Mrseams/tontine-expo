import { router } from 'expo-router';
import { ChevronRight, Flame } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar, Header, Screen, T, Tap } from '@/components/ui';
import { ME, members } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function Profile() {
  const me = members[ME];
  const { tontines } = useStore();
  const links: { label: string; href: '/wallet' | '/history' | '/tontines' }[] = [
    { label: 'Mon portefeuille', href: '/wallet' },
    { label: 'Historique', href: '/history' },
    { label: 'Vos tontines', href: '/tontines' },
  ];

  return (
    <Screen>
      <Header />
      <Animated.View entering={FadeInDown.duration(450)} style={{ alignItems: 'center', marginTop: 24 }}>
        <View className="rounded-full border-4 border-white">
          <Avatar uri={me.avatar} size={88} />
        </View>
        <T className="mt-3 font-semibold text-[22px]">
          {me.firstName} {me.lastName}
        </T>
        <View className="mt-2 flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
          <Flame size={12} color="#FF7A1A" fill="#FF7A1A" />
          <T className="text-[12px]">96 · Score de crédibilité</T>
        </View>
        <T className="mt-2 text-[12px] text-muted">Membre de {tontines.length} tontines</T>
      </Animated.View>

      <View className="mx-5 mt-8 rounded-3xl bg-white px-4">
        {links.map((l, i) => (
          <Tap key={l.href} onPress={() => router.push(l.href)} className={`flex-row items-center justify-between py-4 ${i ? 'border-t border-line' : ''}`}>
            <T className="text-[14px]">{l.label}</T>
            <ChevronRight size={16} color="#8E8E96" />
          </Tap>
        ))}
      </View>
    </Screen>
  );
}
