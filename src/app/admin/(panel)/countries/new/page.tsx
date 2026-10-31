import { saveCountry } from "@/app/admin/actions";
import { CountryForm } from "@/components/admin/CountryForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewCountryPage() {
  return (
    <>
      <PageHeader title="New country" back={{ href: "/admin/countries", label: "Countries" }} />
      <CountryForm action={saveCountry.bind(null, null)} />
    </>
  );
}
