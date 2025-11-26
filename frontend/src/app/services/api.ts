const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // skip ngrok warning page
};

export const api = {
  // file ops
  uploadFile: async function (file: File, folderId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) {
      formData.append("folderId", folderId);
    }

    const response = await fetch(`${apiUrl}/files/upload`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true", // here
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload file");

    return response.json();
  },

  getFiles: async function (folderId?: string) {
    const url = folderId ? `${apiUrl}/files?folderId=${folderId}` : `${apiUrl}/files`;
    const response = await fetch(url, {
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to fetch file");

    return response.json();
  },

  downloadFile: async function (fileId: string) {
    const response = await fetch(`${apiUrl}/files/download/${fileId}`, {
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to download file");

    return response.json();
  },

  deleteFile: async function (fileId: string) {
    const response = await fetch(`${apiUrl}/files/${fileId}`, {
      method: "DELETE",
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to to delete file");

    return response.json();
  },

  getStorageInfo: async function () {
    const response = await fetch(`${apiUrl}/files/storage/info`, {
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to fetch storage info");

    return response.json();
  },

  // folder ops
  createFolder: async function (name: string, parentId?: string) {
    const response = await fetch(`${apiUrl}/folders`, {
      method: "POST",
      headers: defaultHeaders, // here
      body: JSON.stringify({ name, parentId: parentId || null }),
    });

    if (!response.ok) throw new Error("Failed to create folder");

    return response.json();
  },

  getFolders: async function (parentId?: string) {
    const url = parentId !== undefined ? `${apiUrl}/folders?parentId=${parentId || null}` : `${apiUrl}/folders`;
    const response = await fetch(url, {
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to fetch folders");

    return response.json();
  },

  getFolderContents: async function (folderId: string) {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to fetch folder contents");

    return response.json();
  },

  deleteFolder: async function (folderId: string) {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      method: "DELETE",
      headers: defaultHeaders, // here
    });

    if (!response.ok) throw new Error("Failed to delete folder");

    return response.json();
  },
};
