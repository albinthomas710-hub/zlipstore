// Remove the outer layout header since AdminDashboard.tsx has its own header
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
