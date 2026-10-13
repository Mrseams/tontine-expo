import { View } from 'react-native';

import { formatFcfa, type Transaction } from '@/lib/data';
import { MethodBadge, T } from './ui';

export function TxRow({ tx }: { tx: Transaction }) {
  const cancelled = tx.status === 'cancelled';
  const color = cancelled ? 'text-muted line-through' : tx.amount > 0 ? 'text-success' : 'text-ink';
  return (
    <View className="flex-row items-center gap-3 py-3">
      <MethodBadge method={tx.method} size={36} />
      <View className="flex-1">
        <T className="text-[13px]">{tx.title}</T>
        <T className="text-[10px] text-muted">{cancelled ? `Annulée · ${tx.subtitle}` : tx.subtitle}</T>
      </View>
      <T className={`text-[12px] ${color}`}>
        {tx.amount > 0 ? '+' : '-'}
        {formatFcfa(tx.amount)} Fcfa
      </T>
    </View>
  );
}
