import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { saveCountry } from "@/modules/geography/actions";
import { CountryForm } from "@/modules/geography/ui/CountryForm";

export default function NewCountryPage() {
  return (
    <>
      <PageHeader title="New country" back={{ href: "/admin/countries", label: "Countries" }} />
      <CountryForm action={saveCountry.bind(null, null)} />
    </>
  );
}
