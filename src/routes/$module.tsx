import { createFileRoute, notFound } from "@tanstack/react-router";
import { ClinicShell } from "@/features/clinic/shell";
import { modules, type ModuleSlug } from "@/features/clinic/modules";
import { ProtectedModule } from "@/features/auth/protected-module";

export const Route = createFileRoute("/$module")({
  beforeLoad: ({ params }) => {
    if (!modules.some((m) => m.slug === params.module)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${modules.find((m) => m.slug === params.module)?.title ?? "Módulo"} | Clínica` },
    ],
  }),
  component: ModulePage,
});
function ModulePage() {
  const { module } = Route.useParams();
  // A keyed boundary discards any previous module's authorization immediately.
  return (
    <ClinicShell>
      <ProtectedModule key={module} module={module as ModuleSlug} />
    </ClinicShell>
  );
}
