import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: string): string {
  return format(parseISO(date), "dd MMM yyyy", { locale: ptBR });
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ptBR });
}

export function isOverdue(date: string): boolean {
  return isBefore(parseISO(date), new Date());
}

export function isDueSoon(date: string): boolean {
  const dueDate = parseISO(date);
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  return isAfter(dueDate, new Date()) && isBefore(dueDate, twoDaysFromNow);
}

export function formatInputDate(date: string | null): string {
  if (!date) return "";
  return format(parseISO(date), "yyyy-MM-dd");
}
