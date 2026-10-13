import type { ImageSource } from 'expo-image';

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Membre';
  avatar: ImageSource;
};

export type Tontine = {
  id: string;
  name: string;
  amount: number;
  period: 'mois' | 'sem';
  adminId: string;
  tour: number;
  totalTours: number;
  /** Members in payout order: memberIds[i] receives the pot on tour i + 1. */
  memberIds: string[];
  /** Members who already paid in for the current tour, with minutes since payment. */
  paid: Record<string, number>;
  startMonth: number; // 0-based month of tour 1
  startYear: number;
  endsInDays: number;
  history: number[]; // amounts collected on past tours, for the mini chart
};

export type TxStatus = 'success' | 'cancelled';
export type TxMethod = 'momo' | 'om';

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // signed
  method: TxMethod;
  status: TxStatus;
};

// Portraits are bundled locally (Unsplash, free licence) so the app works offline.
export const ME = 'emmanuel';

export const members: Record<string, Member> = {
  emmanuel: { id: 'emmanuel', firstName: 'Emmanuel', lastName: 'ESSAM', role: 'Admin', avatar: require('@/assets/avatars/emmanuel.png') },
  karl: { id: 'karl', firstName: 'Karl', lastName: 'LOTTIN', role: 'Membre', avatar: require('@/assets/avatars/karl.jpg') },
  lince: { id: 'lince', firstName: 'Lince', lastName: 'HERMAN', role: 'Membre', avatar: require('@/assets/avatars/lince.jpg') },
  aicha: { id: 'aicha', firstName: 'Aïcha', lastName: 'BELLO', role: 'Membre', avatar: require('@/assets/avatars/aicha.jpg') },
  carine: { id: 'carine', firstName: 'Carine', lastName: 'NGO BIYONG', role: 'Membre', avatar: require('@/assets/avatars/carine.jpg') },
  junior: { id: 'junior', firstName: 'Junior', lastName: 'MBARGA', role: 'Membre', avatar: require('@/assets/avatars/junior.jpg') },
  mireille: { id: 'mireille', firstName: 'Mireille', lastName: 'ATANGANA', role: 'Membre', avatar: require('@/assets/avatars/mireille.jpg') },
  paul: { id: 'paul', firstName: 'Paul', lastName: 'ESSOMBA', role: 'Membre', avatar: require('@/assets/avatars/paul.jpg') },
  robert: { id: 'robert', firstName: 'Robert', lastName: 'AMOUGOU', role: 'Membre', avatar: require('@/assets/avatars/robert.jpg') },
  grace: { id: 'grace', firstName: 'Grâce', lastName: 'FOTSO', role: 'Membre', avatar: require('@/assets/avatars/grace.jpg') },
  yannick: { id: 'yannick', firstName: 'Yannick', lastName: 'NJOYA', role: 'Membre', avatar: require('@/assets/avatars/yannick.jpg') },
  sandrine: { id: 'sandrine', firstName: 'Sandrine', lastName: 'EKAMBI', role: 'Membre', avatar: require('@/assets/avatars/sandrine.jpg') },
  fabrice: { id: 'fabrice', firstName: 'Fabrice', lastName: 'TCHOUA', role: 'Membre', avatar: require('@/assets/avatars/fabrice.jpg') },
  esther: { id: 'esther', firstName: 'Esther', lastName: 'MOUKOKO', role: 'Membre', avatar: require('@/assets/avatars/esther.jpg') },
};

export const initialTontines: Tontine[] = [
  {
    id: 'voiture',
    name: 'Tontine voiture',
    adminId: 'emmanuel',
    amount: 100_000,
    period: 'mois',
    tour: 9,
    totalTours: 12,
    memberIds: ['emmanuel', 'karl', 'lince', 'aicha', 'carine', 'junior', 'mireille', 'paul', 'robert', 'grace', 'yannick', 'sandrine'],
    paid: { karl: 120, lince: 125, aicha: 180, carine: 240, junior: 300, mireille: 420, paul: 600, robert: 900 },
    startMonth: 2,
    startYear: 2026,
    endsInDays: 2,
    history: [1_200_000, 1_100_000, 1_200_000, 1_200_000, 1_000_000, 1_200_000, 1_200_000, 1_100_000],
  },
  {
    id: 'famille',
    name: 'Tontine famille',
    adminId: 'grace',
    amount: 15_000,
    period: 'mois',
    tour: 5,
    totalTours: 10,
    memberIds: ['grace', 'emmanuel', 'esther', 'fabrice', 'sandrine', 'aicha', 'yannick', 'carine', 'junior', 'paul'],
    paid: { grace: 60, esther: 200, fabrice: 400, emmanuel: 2000 },
    startMonth: 5,
    startYear: 2026,
    endsInDays: 6,
    history: [150_000, 135_000, 150_000, 150_000],
  },
  {
    id: 'vacances',
    name: 'Tontine vacances',
    adminId: 'sandrine',
    amount: 10_000,
    period: 'sem',
    tour: 8,
    totalTours: 10,
    memberIds: ['sandrine', 'yannick', 'emmanuel', 'mireille', 'karl', 'esther', 'fabrice', 'grace', 'lince', 'paul'],
    paid: { sandrine: 30, yannick: 90 },
    startMonth: 7,
    startYear: 2026,
    endsInDays: 4,
    history: [100_000, 90_000, 100_000, 100_000, 80_000, 100_000, 100_000],
  },
];

export const initialTransactions: Transaction[] = [
  { id: 't1', title: 'Retrait MoMo', subtitle: '31 oct. 2026', amount: -520_000, method: 'momo', status: 'success' },
  { id: 't2', title: 'Cotisation', subtitle: 'Tontine famille · 30 oct.', amount: -15_000, method: 'om', status: 'success' },
  { id: 't3', title: 'Cagnotte reçue', subtitle: 'Tontine voiture · 29 oct.', amount: 1_200_000, method: 'momo', status: 'success' },
  { id: 't4', title: 'Cotisation', subtitle: 'Tontine vacances · 22 oct.', amount: -10_000, method: 'momo', status: 'cancelled' },
];

export const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const MONTHS_SHORT = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/** Payout date of a given tour (1-based): the 1st of the month. */
export function tourDate(t: Tontine, tour: number) {
  const date = new Date(t.startYear, t.startMonth + tour - 1, 1);
  return {
    day: '01',
    month: MONTHS[date.getMonth()],
    monthShort: MONTHS_SHORT[date.getMonth()],
    year: date.getFullYear(),
    weekday: DAYS[date.getDay()],
  };
}

export function formatFcfa(n: number) {
  return Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function timeAgo(minutes: number) {
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (minutes < 60 * 24) return `Il y a ${Math.floor(minutes / 60)} h`;
  return `Il y a ${Math.floor(minutes / (60 * 24))} j`;
}
