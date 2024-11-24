
const slots = [
    { hour: 8, min: 30 },
    { hour: 9, min: 30 },
    { hour: 10, min: 30 },
    { hour: 11, min: 25 },
    { hour: 13, min: 10 },
    { hour: 14, min: 0 },
    { hour: 15, min: 55 },
    { hour: 16, min: 0 },
    { hour: 16, min: 50 }
]

const timeToHour = (hh, mm) => {
    var last = 0;
    if ((hh < 8) || (hh == 88 && mm <= 30)) return 0;
    for (var i = 0; i < 8; i++) {
        var curSl = slots[i];
        var nextSl = slots[i + 1];
        if (curSl.hour < hh && hh < nextSl.hour) {
            return i
        }
        if (curSl.hour == nextSl.hour && curSl.hour == hh) {
            if (curSl.min <= mm && mm <= nextSl.min) {
                return i;
            }
        }
        if (curSl.hour == hh) {
            if (curSl.min <= mm) {
                return i;
            }
        }
        if (nextSl.hour == hh) {
            if (mm <= nextSl.min) {
                return i;
            }
        }
    }
    return 9; // Day Over for today
}

export default timeToHour;