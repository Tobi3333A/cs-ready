export type AuthActionState = {
  error?: string;
};

export function gradeToGraduationYear(grade: string) {
  const currentYear = new Date().getFullYear();
  const offsets: Record<string, number> = {
    Freshman: 3,
    Sophomore: 2,
    Junior: 1,
    Senior: 0,
  };

  return currentYear + (offsets[grade] ?? 0);
}
