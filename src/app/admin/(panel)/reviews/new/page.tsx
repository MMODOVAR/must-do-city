import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { createReview } from "@/modules/reviews/actions";
import { AdminReviewForm } from "@/modules/reviews/ui/AdminReviewForm";
import { experiencesService } from "@/modules/experiences/service";

export default async function NewReviewPage({ searchParams }: { searchParams: Promise<{ experience?: string }> }) {
  const [{ experience }, experiences] = await Promise.all([searchParams, experiencesService.options()]);
  return (
    <>
      <PageHeader title="Add review" subtitle="For reviews collected outside the site." back={{ href: "/admin/reviews", label: "Reviews" }} />
      <AdminReviewForm action={createReview} experiences={experiences} defaultExperienceId={experience} />
    </>
  );
}
