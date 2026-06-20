import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Tanpa sesi (mis. halaman login) -> render polos tanpa shell.
  if (!session?.user) return <>{children}</>;

  return <AdminShell userEmail={session.user.email ?? "admin"}>{children}</AdminShell>;
}
