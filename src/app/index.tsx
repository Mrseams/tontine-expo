import { router } from 'expo-router';
import { Bell, Flame, House, Plus, User } from 'lucide-react-native';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WalletGlyph } from '@/components/art';
import { TontineCard } from '@/components/tontine-card';
import { Avatar, IconButton, Screen, T, Tap, useCountUp } from '@/components/ui';
import { formatFcfa, ME, members, type Tontine } from '@/lib/data';
import { useStore } from '@/lib/store';

const GAP = 12;

function CarouselItem({ tontine, index, width, scrollX }: { tontine: Tontine; index: number; width: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const pos = scrollX.value / (width + GAP);
    const d = Math.abs(pos - index);
    return {
      transform: [{ scale: interpolate(d, [0, 1], [1, 0.92], Extrapolation.CLAMP) }],
      opacity: interpolate(d, [0, 1.5], [1, 0.75], Extrapolation.CLAMP),
    };
  });
  return (
    <Animated.View style={[{ marginRight: GAP }, style]}>
      <Tap scaleTo={0.96} onPress={() => router.push(`/tontines/${tontine.id}`)}>
        <TontineCard tontine={tontine} width={width} />
      </Tap>
    </Animated.View>
  );
}

export default function Home() {
  const { balance, tontines } = useStore();
  const { width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const shown = useCountUp(balance);
  const me = members[ME];

  const cardW = Math.min(screenW * 0.58, 260);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <Screen>
      <View className="h-14 flex-row items-center justify-between px-5">
        <Tap scaleTo={0.9} onPress={() => router.push('/profile')}>
          <Avatar uri={me.avatar} size={38} />
        </Tap>
        <View className="flex-row gap-2">
          <IconButton>
            <Plus size={18} color="#0B0B0F" />
          </IconButton>
          <IconButton>
            <Bell size={18} color="#0B0B0F" />
          </IconButton>
        </View>
      </View>

      <Animated.View entering={FadeInDown.duration(500)}>
        <View className="mt-6 px-5">
          <View className="flex-row items-center gap-1">
            <Flame size={11} color="#FF7A1A" fill="#FF7A1A" />
            <T className="font-semibold text-[11px]">96</T>
            <T className="text-[11px] text-muted">Score de crédibilité</T>
          </View>
          <T className="mt-2 font-semibold text-[28px] leading-[32px] tracking-tight">Bonjour, {me.firstName}</T>
          <T className="font-semibold text-[28px] leading-[32px] tracking-tight text-faint">Prêt à cotiser ?</T>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <Tap className="mx-5 mt-5 flex-row items-center justify-between rounded-3xl bg-white px-5 py-4" onPress={() => router.push('/wallet')}>
          <View>
            <T className="text-[11px] text-muted">Votre portefeuille</T>
            <T className="mt-1 font-semibold text-[24px] tracking-tight">
              {formatFcfa(shown)}
              <T className="text-[13px] text-muted"> Fcfa</T>
            </T>
          </View>
          <WalletGlyph size={38} />
        </Tap>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View className="mt-6 flex-row items-center justify-between px-5">
          <T className="text-[13px]">Vos tontines</T>
          <Tap onPress={() => router.push('/tontines')}>
            <T className="text-[12px] text-ink/70">Voir plus</T>
          </Tap>
        </View>
        <Animated.FlatList
          data={tontines}
          keyExtractor={(t) => t.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardW + GAP}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
          renderItem={({ item, index }) => <CarouselItem tontine={item} index={index} width={cardW} scrollX={scrollX} />}
        />
      </Animated.View>

      {/* Floating tab bar */}
      <View className="absolute left-0 right-0 items-center" style={{ bottom: insets.bottom + 16 }}>
        <View className="flex-row items-center gap-1 rounded-full bg-white p-1.5 shadow-sm">
          <View className="flex-row items-center gap-1.5 rounded-full bg-canvas px-4 py-2.5">
            <House size={15} color="#0B0B0F" fill="#0B0B0F" />
            <T className="text-[13px]">Accueil</T>
          </View>
          <Tap scaleTo={0.9} className="px-4 py-2.5" onPress={() => router.push('/profile')}>
            <User size={17} color="#8E8E96" />
          </Tap>
        </View>
      </View>
    </Screen>
  );
}
