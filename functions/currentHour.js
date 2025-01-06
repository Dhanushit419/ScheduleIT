const slots = [
    { hour: 8, min: 30, endHour: 9, endMin: 20 },
    { hour: 9, min: 25, endHour: 10, endMin: 15 },
    { hour: 10, min: 30, endHour: 11, endMin: 20 },
    { hour: 11, min: 25, endHour: 12, endMin: 15 },
    { hour: 13, min: 10, endHour: 14, endMin: 0 },
    { hour: 14, min: 5, endHour: 14, endMin: 55 },
    { hour: 15, min: 0, endHour: 15, endMin: 50 },
    { hour: 15, min: 55, endHour: 16, endMin: 45 }
];

const timeToHour = (hh, mm) => {
    if (hh < 8 || (hh === 8 && mm < 30)) return 0;

    for (let i = 0; i < slots.length; i++) {
        const { hour, min, endHour, endMin } = slots[i];
        if ((hh > hour || (hh === hour && mm >= min)) && (hh < endHour || (hh === endHour && mm <= endMin))) {
            return i + 1;
        }
        if (i > 0 && (hh < hour || (hh === hour && mm < min))) {
            return i + 0.5;
        }
    }

    return 9; // Day Over for today
};

export default timeToHour;
