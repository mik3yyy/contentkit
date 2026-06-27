import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Stable Cloudflare CDN URL — cacheable, no AWS overhead, used for landing page previews.
export function getPublicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "")
  return `${base}/${key}`
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function getDownloadUrl(key: string, filename?: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    // Embed Content-Disposition in the signed URL so browsers download (not open) the file.
    // This also eliminates CORS for link-click downloads (navigation ≠ fetch).
    ...(filename
      ? { ResponseContentDisposition: `attachment; filename="${encodeURIComponent(filename)}"` }
      : {}),
  })
  return getSignedUrl(r2, command, { expiresIn: 3600 })
}
