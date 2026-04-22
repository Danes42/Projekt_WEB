/**
 * NASTAVENÍ DOSTUPNOSTI - zde upravujte termíny
 * -----------------------------------------------
 * workingHours: pracovní hodiny pro každý den v týdnu (1=Po, 6=So)
 * dailyBlocks:  časy vždy blokované (pauza)
 * booked:       obsazené termíny, formát 'RRRR-MM-DD': ['HH:MM', ...]
 * daysOff:      dny volna / svátky, formát 'RRRR-MM-DD'
 */
const AVAILABILITY = {
  workingHours: {
    1: { start: '09:00', end: '18:00' }, // Pondělí
    2: { start: '09:00', end: '18:00' }, // Úterý
    3: { start: '09:00', end: '18:00' }, // Středa
    4: { start: '09:00', end: '18:00' }, // Čtvrtek
    5: { start: '09:00', end: '17:00' }, // Pátek
    6: { start: '09:00', end: '13:00' }, // Sobota (dopoledne)
  },

  // Časy vždy blokované (oběd)
  dailyBlocks: ['12:00'],

  // Délka konzultace v minutách (pro informaci)
  slotDuration: 60,

  // Obsazené termíny — přidejte/odeberte podle rezervací
  booked: {
    '2026-04-22': ['09:00', '10:00', '14:00'],
    '2026-04-23': ['11:00', '15:00', '16:00'],
    '2026-04-24': ['09:00', '10:00', '14:00'],
    '2026-04-25': ['11:00', '13:00'],
    '2026-04-27': ['09:00', '10:00', '11:00'],
    '2026-04-28': ['14:00', '15:00'],
    '2026-04-29': ['09:00', '11:00'],
    '2026-04-30': ['10:00', '16:00'],
    '2026-05-05': ['09:00', '14:00', '15:00'],
    '2026-05-06': ['11:00', '13:00', '14:00'],
    '2026-05-07': ['09:00', '10:00'],
  },

  // Dny volna a svátky
  daysOff: [
    '2026-05-01', // Svátek práce
    '2026-05-08', // Den vítězství
    '2026-07-05', // Jan Hus
    '2026-07-06', // Cyrila a Metoděje
  ],
};
