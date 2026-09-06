export type Gender = "male" | "female" | "unspecified";

export const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: "Muž", value: "male" },
  { label: "Žena", value: "female" },
  { label: "Nechcem uviesť", value: "unspecified" },
];

export const genderFilterOptions: Array<{ label: string; value: Gender }> = [
  { label: "Muži", value: "male" },
  { label: "Ženy", value: "female" },
  { label: "Neuvedené", value: "unspecified" },
];

export const allGenderValues = genderOptions.map((option) => option.value);

export function getGenderLabel(value: Gender) {
  return genderOptions.find((option) => option.value === value)?.label ?? value;
}

export function getGenderFilterSummary(values: Gender[]) {
  if (values.length === 0 || values.length === genderFilterOptions.length) {
    return "Všetci";
  }

  return genderFilterOptions
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(", ");
}
