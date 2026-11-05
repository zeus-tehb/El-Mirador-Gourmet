import { useEffect, useState } from 'react';

export const BUSINESS_HOURS_STORAGE_KEY = 'el-mirador-business-hours';

export const weekdayNames = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const bookingEnvironments = ['Terraza', 'Salón principal', 'Zona privada'];

export const partySizeTiers = [
  { label: '1–2 personas', maxPeople: 2 },
  { label: '3–4 personas', maxPeople: 4 },
  { label: '5–6 personas', maxPeople: 6 },
  { label: '7–12 personas', maxPeople: 12 },
];

export function createDefaultPricing() {
  return {
    Terraza: [40, 60, 80, 100],
    'Salón principal': [30, 45, 60, 75],
    'Zona privada': [70, 100, 130, 160],
  };
}

const holidaySchedule = {
  enabled: true,
  opening: '12:00',
  closing: '18:00',
  lastReservation: '16:00',
  reason: 'Horario festivo',
  isFestive: true,
};

function isFestiveDate(date) {
  const [, month, day] = date.split('-');
  return (month === '12' && ['24', '25', '31'].includes(day))
    || (month === '01' && day === '01');
}

export function createDefaultBusinessHours() {
  return {
    weekly: Object.fromEntries(weekdayNames.map((name, day) => [day, {
      name,
      enabled: true,
      opening: day === 0 ? '09:00' : '12:00',
      closing: '22:00',
      lastReservation: day === 0 ? '20:00' : '20:30',
      closedReason: '',
    }])),
    exceptions: [],
    pricing: createDefaultPricing(),
  };
}

export function readBusinessHours() {
  const defaults = createDefaultBusinessHours();
  const saved = window.localStorage.getItem(BUSINESS_HOURS_STORAGE_KEY);
  if (!saved) return defaults;

  try {
    const parsed = JSON.parse(saved);
    return {
      weekly: { ...defaults.weekly, ...(parsed.weekly || {}) },
      exceptions: Array.isArray(parsed.exceptions) ? parsed.exceptions : [],
      pricing: Object.fromEntries(bookingEnvironments.map((environment) => [
        environment,
        Array.isArray(parsed.pricing?.[environment]) && parsed.pricing[environment].length === partySizeTiers.length
          ? parsed.pricing[environment]
          : defaults.pricing[environment],
      ])),
    };
  } catch (error) {
    console.error('No se pudo leer la configuración de horarios guardada.', error);
    return defaults;
  }
}

export function saveBusinessHours(settings) {
  window.localStorage.setItem(BUSINESS_HOURS_STORAGE_KEY, JSON.stringify(settings));
}

export function useBusinessHours() {
  const [settings, setSettings] = useState(readBusinessHours);

  useEffect(() => {
    function syncSettings(event) {
      if (!event.key || event.key === BUSINESS_HOURS_STORAGE_KEY) {
        setSettings(readBusinessHours());
      }
    }

    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  return settings;
}

export function getScheduleForDate(date, settings) {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = new Date(year, month - 1, day).getDay();
  const exception = settings.exceptions.find((item) => item.date === date);

  if (exception) {
    return {
      ...exception,
      isException: true,
      enabled: !exception.closed,
    };
  }

  if (isFestiveDate(date)) {
    return { ...holidaySchedule, isException: false };
  }

  return { ...settings.weekly[weekday], isException: false };
}

export function getEnvironmentPrice(pricing, environment, people) {
  const tierIndex = partySizeTiers.findIndex((tier) => people <= tier.maxPeople);
  const prices = pricing[environment];
  if (tierIndex < 0 || !prices || !Number.isFinite(Number(prices[tierIndex]))) return 0;
  return Number(prices[tierIndex]);
}

export function getReservationSlots(schedule) {
  if (!schedule?.enabled || !schedule.opening || !schedule.lastReservation) return [];

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const start = toMinutes(schedule.opening);
  const end = toMinutes(schedule.lastReservation);
  if (end < start) return [];

  const formatTime = (minutes) => {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour24 >= 12 ? 'pm' : 'am';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
  };

  return Array.from({ length: Math.floor((end - start) / 30) + 1 }, (_, index) => (
    formatTime(start + index * 30)
  ));
}

export function formatBusinessTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${period}`;
}
