export const generateBookingId = () => {
  const prefix = 'LW';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

export const getTodayDateString = (refDate = new Date()) => {
  const year = refDate.getFullYear();
  const month = String(refDate.getMonth() + 1).padStart(2, '0');
  const day = String(refDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPickupSlots = () => {
  return [
    { id: 'slot-10-00', label: '10:00 AM – 10:30 AM', time: '10:00 AM', hour: 10, minute: 0 },
    { id: 'slot-10-30', label: '10:30 AM – 11:00 AM', time: '10:30 AM', hour: 10, minute: 30 },
    { id: 'slot-11-00', label: '11:00 AM – 11:30 AM', time: '11:00 AM', hour: 11, minute: 0 },
    { id: 'slot-11-30', label: '11:30 AM – 12:00 PM', time: '11:30 AM', hour: 11, minute: 30 },
    { id: 'slot-12-00', label: '12:00 PM – 12:30 PM', time: '12:00 PM', hour: 12, minute: 0 },
    { id: 'slot-12-30', label: '12:30 PM – 01:00 PM', time: '12:30 PM', hour: 12, minute: 30 },
    { id: 'slot-13-00', label: '01:00 PM – 01:30 PM', time: '01:00 PM', hour: 13, minute: 0 },
    { id: 'slot-13-30', label: '01:30 PM – 02:00 PM', time: '01:30 PM', hour: 13, minute: 30 },
    { id: 'slot-14-00', label: '02:00 PM – 02:30 PM', time: '02:00 PM', hour: 14, minute: 0 },
    { id: 'slot-14-30', label: '02:30 PM – 03:00 PM', time: '02:30 PM', hour: 14, minute: 30 },
    { id: 'slot-15-00', label: '03:00 PM – 03:30 PM', time: '03:00 PM', hour: 15, minute: 0 },
    { id: 'slot-15-30', label: '03:30 PM – 04:00 PM', time: '03:30 PM', hour: 15, minute: 30 },
    { id: 'slot-16-00', label: '04:00 PM – 04:30 PM', time: '04:00 PM', hour: 16, minute: 0 },
    { id: 'slot-16-30', label: '04:30 PM – 05:00 PM', time: '04:30 PM', hour: 16, minute: 30 },
    { id: 'slot-17-00', label: '05:00 PM – 05:30 PM', time: '05:00 PM', hour: 17, minute: 0 },
    { id: 'slot-17-30', label: '05:30 PM – 06:00 PM', time: '05:30 PM', hour: 17, minute: 30 },
    { id: 'slot-18-00', label: '06:00 PM – 06:30 PM', time: '06:00 PM', hour: 18, minute: 0 },
    { id: 'slot-18-30', label: '06:30 PM – 07:00 PM', time: '06:30 PM', hour: 18, minute: 30 },
    { id: 'slot-19-00', label: '07:00 PM – 07:30 PM', time: '07:00 PM', hour: 19, minute: 0 },
    { id: 'slot-19-30', label: '07:30 PM – 08:00 PM', time: '07:30 PM', hour: 19, minute: 30 },
    { id: 'slot-20-00', label: '08:00 PM (Last Slot)', time: '08:00 PM', hour: 20, minute: 0 }
  ];
};

export const isSlotPastForDate = (slot, dateStr, refDate = new Date()) => {
  const todayStr = getTodayDateString(refDate);
  if (dateStr !== todayStr) return false;
  const currentMinutes = refDate.getHours() * 60 + refDate.getMinutes();
  const slotMinutes = slot.hour * 60 + slot.minute;
  return slotMinutes <= currentMinutes;
};

export const getNextDays = (count = 7) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isToday = i === 0;
    const isTomorrow = i === 1;

    let dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (isToday) dayName = 'Today';
    else if (isTomorrow) dayName = 'Tomorrow';

    days.push({
      dateStr: getTodayDateString(d),
      displayDay: dayName,
      displayDate: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      isToday,
      raw: d
    });
  }
  return days;
};

