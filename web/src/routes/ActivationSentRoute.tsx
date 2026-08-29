import { InfoScreen } from "src/features/info";

export function ActivationSentRoute() {
  return (
    <InfoScreen
      variant="info"
      title="Skontroluj si email"
      message="Inštrukcie na aktiváciu účtu sme odoslali na tvoju emailovú adresu. Po kliknutí na aktivačný link ťa aplikácia automaticky prihlási."
    />
  );
}
