"use client";

import { useRouter } from "next/navigation";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const router = useRouter();

  // This component just redirects to the detail page
  // The actual implementation is in [id]/page.tsx
  router.push(`/dashboard/todo/projects/${projectId}`);

  return null;
}