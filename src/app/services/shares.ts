import { api } from "./api";

export interface ShareLinkResponse {
  success: boolean;
  shareLink: {
    id: string;
    token: string;
    url: string;
    expiresAt: number | null;
    expiresAtFormatted: string;
    remainingTime: string;
  };
}

export interface ShareListResponse {
  success: boolean;
  stats: {
    total: number;
    active: number;
    expired: number;
    totalAccesses: number;
  };
  shares: Array<{
    id: string;
    token: string;
    url: string;
    fileId: string | null;
    folderId: string | null;
    createdAt: number;
    expiresAt: number | null;
    expiresAtFormatted: string;
    remainingTime: string;
    disabled: boolean;
    accessCount: number;
    isValid: boolean;
  }>;
}

export interface SharedContentResponse {
  success: boolean;
  type: "file" | "folder";
  file?: {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt: number;
  };
  folder?: {
    id: string;
    name: string;
    fileCount: number;
    folderCount: number;
  };
  files?: Array<{
    id: string;
    name: string;
    size: number;
    mimeType: string;
  }>;
  folders?: Array<{
    id: string;
    name: string;
  }>;
  expiresAt: number | null;
  expiresAtFormatted: string;
  remainingTime: string;
}

export const shareService = {
  // Create share link for file
  createFileShare: async (fileId: string, expiresIn: number | null): Promise<ShareLinkResponse> => {
    return await api.createFileShare(fileId, expiresIn);
  },

  // Create share link for folder
  createFolderShare: async (folderId: string, expiresIn: number | null): Promise<ShareLinkResponse> => {
    return await api.createFolderShare(folderId, expiresIn);
  },

  // Get all user's share links
  listShares: async (): Promise<ShareListResponse> => {
    return await api.listShares();
  },

  // Disable a share link
  disableShare: async (shareId: string): Promise<{ success: boolean; message: string }> => {
    return await api.disableShare(shareId);
  },

  // Access shared content (public - no auth)
  accessShared: async (token: string): Promise<SharedContentResponse> => {
    return await api.accessShared(token);
  },

  // Download shared file (public - no auth)
  downloadShared: async (token: string): Promise<{ success: boolean; filename: string }> => {
    return await api.downloadShared(token);
  },

  // Get presets
  getPresets: async () => {
    return await api.getSharePresets();
  },
};
