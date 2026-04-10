export function normalizeCourseLevel(level: string): "beginner" | "intermediate" | "advanced" | "unknown" {
  const value = level.trim().toLowerCase();

  if (value === "beginner") {
    return "beginner";
  }
  if (value === "intermediate") {
    return "intermediate";
  }
  if (value === "advanced") {
    return "advanced";
  }
  return "unknown";
}
