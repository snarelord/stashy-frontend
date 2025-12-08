const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // skip ngrok warning page
};

function getAuthHeaders(extraHeaders = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export const api = {
  getFile: async function (fileId: string) {
    try {
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request password reset");
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch single file: ", error);
      throw error;
    }
  },

  signUp: async function (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    accessCode: string
  ) {
    try {
      const response = await fetch(`${apiUrl}/users/sign-up`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, firstName, lastName, password, confirmPassword, accessCode: String(accessCode) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      return data;
    } catch (error) {
      console.error("Failed to sign up: ", error);
      throw error;
    }
  },

  forgotPassword: async function (email: string) {
    try {
      const response = await fetch(`${apiUrl}/users/forgot-password`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request password reset");
      }

      return data;
    } catch (error) {
      console.error("Failed to request password reset: ", error);
      throw error;
    }
  },

  // file ops
  uploadFile: async function (file: File, folderId?: string) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (folderId) {
        formData.append("folderId", folderId);
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: any = {};

      if (token) headers["Authorization"] = `Bearer ${token}`;
      headers["ngrok-skip-browser-warning"] = "true";

      const response = await fetch(`${apiUrl}/files/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      return data;
    } catch (error) {
      console.error("Failed to upload file: ", error);
    }
  },

  getFiles: async function (folderId?: string) {
    try {
      const url = folderId ? `${apiUrl}/files?folderId=${folderId}` : `${apiUrl}/files`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get files");
      }

      return data;
    } catch (error) {
      console.error("Failed to get files");
      throw error;
    }
  },

  downloadFile: async function (fileId: string) {
    try {
      const response = await fetch(`${apiUrl}/files/download/${fileId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "download";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error("Download error: ", error);
      throw error;
    }
  },

  downloadFolder: async function (folderId: string) {
    try {
      const response = await fetch(`${apiUrl}/folders/${folderId}/download`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to download folder");
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "folder.zip";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error("Download folder error: ", error);
      throw error;
    }
  },

  deleteFile: async function (fileId: string) {
    try {
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete file");
      }

      return data;
    } catch (error) {
      console.error("Failed to delete file: ", error);
      throw error;
    }
  },

  getStorageInfo: async function () {
    try {
      const response = await fetch(`${apiUrl}/files/storage/info`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get storage info");
      }

      return data;
    } catch (error) {
      console.error("Failed to get storage info: ", error);
      throw error;
    }
  },

  getUserInfo: async function () {
    try {
      const response = await fetch(`${apiUrl}/users/me`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get user info");
      }

      return data;
    } catch (error) {
      console.error("Failed to get user info: ", error);
      throw error;
    }
  },

  // folder ops
  createFolder: async function (name: string, parentId?: string) {
    try {
      const response = await fetch(`${apiUrl}/folders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, parentId: parentId || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create folder");
      }

      return data;
    } catch (error) {
      console.error("Failed to create folder: ", error);
      throw error;
    }
  },

  getFolders: async function (parentId?: string) {
    try {
      const url = parentId !== undefined ? `${apiUrl}/folders?parentId=${parentId || null}` : `${apiUrl}/folders`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get folders");
      }

      return data;
    } catch (error) {
      console.error("Failed to get folders: ", error);
      throw error;
    }
  },

  getFolderContents: async function (folderId: string) {
    try {
      const response = await fetch(`${apiUrl}/folders/${folderId}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get folder contents");
      }

      return data;
    } catch (error) {
      console.error("Failed to get folder contents", error);
      throw error;
    }
  },

  deleteFolder: async function (folderId: string) {
    try {
      const response = await fetch(`${apiUrl}/folders/${folderId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Failed to delete folder");

      return data;
    } catch (error) {
      console.error("Failed to delete folder: ", error);
      throw error;
    }
  },

  // share ops
  createFileShare: async function (fileId: string, expiresIn: number | null) {
    try {
      const response = await fetch(`${apiUrl}/shares/file`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ fileId, expiresIn }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create share link");
      }

      return data;
    } catch (error) {
      console.error("Failed to create file share: ", error);
      throw error;
    }
  },

  createFolderShare: async function (folderId: string, expiresIn: number | null) {
    try {
      const response = await fetch(`${apiUrl}/shares/folder`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ folderId, expiresIn }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create share link");
      }

      return data;
    } catch (error) {
      console.error("Failed to create folder share: ", error);
      throw error;
    }
  },

  listShares: async function () {
    try {
      const response = await fetch(`${apiUrl}/shares`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to list shares");
      }

      return data;
    } catch (error) {
      console.error("Failed to list shares: ", error);
      throw error;
    }
  },

  disableShare: async function (shareId: string) {
    try {
      const response = await fetch(`${apiUrl}/shares/${shareId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to disable share link");
      }

      return data;
    } catch (error) {
      console.error("Failed to disable share: ", error);
      throw error;
    }
  },

  accessShared: async function (token: string) {
    try {
      const response = await fetch(`${apiUrl}/shares/access/${token}`, {
        headers: defaultHeaders, // No auth needed - public endpoint
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to access shared content");
      }

      return data;
    } catch (error) {
      console.error("Failed to access shared content: ", error);
      throw error;
    }
  },

  downloadShared: async function (token: string) {
    try {
      const response = await fetch(`${apiUrl}/shares/download/${token}`, {
        headers: defaultHeaders, // No auth needed - public endpoint
      });

      if (!response.ok) {
        throw new Error("Failed to download shared file");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "download";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error("Failed to download shared file: ", error);
      throw error;
    }
  },

  getSharePresets: async function () {
    try {
      const response = await fetch(`${apiUrl}/shares/presets`, {
        headers: defaultHeaders, // No auth needed
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get share presets");
      }

      return data;
    } catch (error) {
      console.error("Failed to get share presets: ", error);
      throw error;
    }
  },
};
