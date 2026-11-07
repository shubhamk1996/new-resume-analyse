import flagsJson from '../../flags.json';

export type PaymentsMode = 'test' | 'live';

const rawMode = (flagsJson as { payments?: { mode?: string } }).payments?.mode;

export const paymentsMode: PaymentsMode = rawMode === 'live' ? 'live' : 'test';
