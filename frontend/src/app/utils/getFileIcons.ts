export function getFileIcon(mimeType: string): string {
  if (!mimeType) return "📄";

  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("text/") || mimeType.includes("document")) return "📄";

  return "📄";
}
