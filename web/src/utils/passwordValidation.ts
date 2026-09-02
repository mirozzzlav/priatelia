export function getPasswordConfirmationError(
  password: string,
  passwordConfirmation: string,
) {
  if (!password || !passwordConfirmation || password === passwordConfirmation) {
    return null;
  }

  return "Heslá sa nezhodujú.";
}
