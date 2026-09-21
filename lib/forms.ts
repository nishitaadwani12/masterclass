/** Reads a form field as a string, treating missing/File values as empty. */
export function readField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}
