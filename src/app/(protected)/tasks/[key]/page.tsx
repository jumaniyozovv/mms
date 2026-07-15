import { TaskDetailPage } from "@/features/tasks/components/task-detail-page";

interface PageProps {
  params: { key: string };
}

export default async function TaskPage({ params }: {params:Promise<{key:string}>}) {
  const {key} = await params;
  return <TaskDetailPage taskKey={key} />;
}