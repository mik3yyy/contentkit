import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import JobStatusClient from "./JobStatusClient"

export default async function ClipJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const session = await auth()
  if (!session) redirect("/sign-in")

  const { jobId } = await params
  return <JobStatusClient jobId={jobId} />
}
