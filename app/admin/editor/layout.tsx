import Paper from "@/components/paper";
import { AdminEditorHeader } from "@/components/admin-editor-header";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Paper>
      <AdminEditorHeader />
      {children}
    </Paper>
  );
}
