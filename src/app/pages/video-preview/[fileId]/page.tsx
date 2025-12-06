"use client";

import VideoPreview from "@/app/components/VideoPreview/VideoPreview";
import { useParams } from "next/navigation";

export default function VideoPreviewPage() {
  const params = useParams();
  const fileId = Array.isArray(params.fileId) ? params.fileId[0] : params.fileId;
  if (!fileId) return null;
  return <VideoPreview fileId={fileId} />;
}
