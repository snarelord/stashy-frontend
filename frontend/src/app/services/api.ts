const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

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
  signUp: async function (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    accessCode: string
  ) {
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
  },

  // file ops
  uploadFile: async function (file: File, folderId?: string) {
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

    if (!response.ok) throw new Error("Failed to upload file");

    return response.json();
  },

  getFiles: async function (folderId?: string) {
    const url = folderId ? `${apiUrl}/files?folderId=${folderId}` : `${apiUrl}/files`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch file");

    return response.json();
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

      console.log(`Downloaded: ${filename}`);
      return { success: true, filename };
    } catch (error) {
      console.error("Download error:", error);
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

      // Get the ZIP blob
      const blob = await response.blob();

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "folder.zip";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`Downloaded folder: ${filename}`);
      return { success: true, filename };
    } catch (error) {
      console.error("Download folder error:", error);
      throw error;
    }
  },

  deleteFile: async function (fileId: string) {
    const response = await fetch(`${apiUrl}/files/${fileId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to to delete file");

    return response.json();
  },

  getStorageInfo: async function () {
    const response = await fetch(`${apiUrl}/files/storage/info`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch storage info");

    return response.json();
  },

  // folder ops
  createFolder: async function (name: string, parentId?: string) {
    const response = await fetch(`${apiUrl}/folders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, parentId: parentId || null }),
    });

    if (!response.ok) throw new Error("Failed to create folder");

    return response.json();
  },

  getFolders: async function (parentId?: string) {
    const url = parentId !== undefined ? `${apiUrl}/folders?parentId=${parentId || null}` : `${apiUrl}/folders`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch folders");

    return response.json();
  },

  getFolderContents: async function (folderId: string) {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch folder contents");

    return response.json();
  },

  deleteFolder: async function (folderId: string) {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete folder");

    return response.json();
  },
};
