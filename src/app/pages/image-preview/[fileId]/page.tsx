"use client";
import ImagePreview from "../../../components/ImagePreview/ImagePreview";

import { useParams } from "next/navigation";

export default function ImagePreviewPage() {
  const params = useParams();
  const fileId = Array.isArray(params.fileId) ? params.fileId[0] : params.fileId;
  if (!fileId) return null;
  return <ImagePreview fileId={fileId} />;
}
