// update later with different icons
export function getFileIcon(type: string): string {
  switch (type) {
    case "audio":
      return "🎵";
    case "image":
      return "🖼️";
    case "video":
      return "🎬";
    case "document":
      return "📄";
    default:
      return "📄";
  }
}
