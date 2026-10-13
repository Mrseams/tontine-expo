import { createContext, useContext, useState, type ReactNode } from 'react';

import { initialTontines, initialTransactions, ME, type Tontine, type Transaction } from './data';

type Store = {
  balance: number;
  tontines: Tontine[];
  transactions: Transaction[];
  getTontine: (id: string) => Tontine | undefined;
  /** Pays the user's share for the current tour. Returns the receipt reference. */
  contribute: (tontineId: string) => string;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(800_000);
  const [tontines, setTontines] = useState(initialTontines);
  const [transactions, setTransactions] = useState(initialTransactions);

  const getTontine = (id: string) => tontines.find((t) => t.id === id);

  const contribute = (tontineId: string) => {
    const t = tontines.find((x) => x.id === tontineId);
    const ref = `RTN-${2600 + (t?.tour ?? 0)}-${Math.floor(10000 + Math.random() * 89999)}`;
    if (!t || t.paid[ME] !== undefined) return ref;

    setTontines((all) => all.map((x) => (x.id === tontineId ? { ...x, paid: { ...x.paid, [ME]: 0 } } : x)));
    setBalance((b) => b - t.amount);
    setTransactions((all) => [
      {
        id: ref,
        title: 'Cotisation',
        subtitle: `${t.name} · Aujourd'hui`,
        amount: -t.amount,
        method: 'momo',
        status: 'success',
      },
      ...all,
    ]);
    return ref;
  };

  return (
    <StoreContext.Provider value={{ balance, tontines, transactions, getTontine, contribute }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
