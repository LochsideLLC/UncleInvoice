import { requireWorkspace } from "@/lib/workspace";
import { WorkspaceSettingsForm } from "@/components/workspace-settings-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { workspace } = await requireWorkspace(workspaceId);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h2 className="text-2xl">Client details</h2>
      <p className="text-muted">
        Finished invoices are emailed to this office address, and it prints on the bill-to
        block.
      </p>
      <WorkspaceSettingsForm workspace={workspace} />
    </div>
  );
}
