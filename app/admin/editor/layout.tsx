import { AdminEditorHeader } from "@/components/admin-editor-header";
import Paper from "@/components/paper";

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
