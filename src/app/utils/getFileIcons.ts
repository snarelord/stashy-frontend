import AudioIcon from "../components/Icons/AudioIcon/AudioIcon";
import ImageIcon from "../components/Icons/ImageIcon/ImageIcon";
import VideoIcon from "../components/Icons/VideoIcon/VideoIcon";
import FileIcon from "../components/Icons/FileIcon/FileIcon";

export function getFileIcon(mimeType: string): string {
  if (!mimeType) return "📄";

  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("text/") || mimeType.includes("document")) return "📄";

  return "📄";
}
