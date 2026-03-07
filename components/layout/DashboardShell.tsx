"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import CreateBoardModal from "@/components/board/CreateBoardModal";
import Loading from "@/components/ui/Loading";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a12]">
        <Loading size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a12]">
      <Sidebar onCreateBoard={() => setCreateBoardOpen(true)} />
      <div className="ml-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </div>
      <CreateBoardModal
        isOpen={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
      />
    </div>
  );
}
