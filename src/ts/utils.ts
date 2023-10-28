import dayjs from "dayjs";

export function formatTime(timestamp: number): string {
  return dayjs(timestamp).format("HH:mm DD.MM.YY");
}

export function truncateSubject(subject: string, maxLength: number): string {
  return subject.length > maxLength ? subject.slice(0, maxLength - 1) + "…" : subject;
}