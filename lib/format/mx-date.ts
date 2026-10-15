/**
 * Flights are stored in UTC but owners enter (and passengers expect) Mexico City
 * wall-clock time. `mxDate` returns a Date whose getUTC* fields hold the Mexico
 * City date/time, so every screen formats the same instant identically on the
 * server and in the browser (no timezone drift, no hydration mismatch).
 */
const TZ = "America/Mexico_City";

const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

export function mxDate(value: string | number | Date): Date {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return d;

    const p: Record<string, number> = {};
    for (const part of formatter.formatToParts(d)) {
        if (part.type !== "literal") p[part.type] = Number(part.value);
    }
    return new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second));
}
