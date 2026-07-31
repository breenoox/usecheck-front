/**
 * The backend's referenceMonth is "MM/yyyy". The UI collects the competency
 * via a native `<input type="month">`, which works in "yyyy-MM" — these
 * helpers convert at that boundary.
 */

export function currentHtmlMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function isValidHtmlMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function htmlMonthToApiMonth(value: string): string {
  const [yyyy, mm] = value.split("-");
  return `${mm}/${yyyy}`;
}

export function apiMonthToLabel(apiMonth: string): string {
  const [mm, yyyy] = apiMonth.split("/");
  const names = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const name = names[Number(mm) - 1];
  return name ? `${name}/${yyyy}` : apiMonth;
}
