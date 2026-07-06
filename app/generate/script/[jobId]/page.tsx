import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ScriptJobStatusClient from "./ScriptJobStatusClient"

export default async function ScriptJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const session = await auth()
  if (!session) redirect("/sign-in")

  const { jobId } = await params
  return <ScriptJobStatusClient jobId={jobId} />
}
