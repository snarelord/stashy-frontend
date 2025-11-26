// helper to get data from localStorage
function getStoredData() {
  if (typeof window === "undefined") return { folders: [], files: [] };

  const stored = localStorage.getItem("stashy_data");
  if (stored) {
    return JSON.parse(stored);
  }

  // default data
  return {
    folders: [
      { id: "new-music", name: "New Music", fileCount: 2, parentId: null },
      { id: "video-bits", name: "Video Bits", fileCount: 2, parentId: null },
    ],
    files: [
      { id: "1", name: "FILE_NAME.mp3", type: "audio", size: "3.2 MB", modified: "2024-11-20", folderId: null },
      { id: "2", name: "image.jpeg", type: "image", size: "1.8 MB", modified: "2024-11-19", folderId: null },
    ],
  };
}

// helper to save data to localStorage
function saveStoredData(data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("stashy_data", JSON.stringify(data));
  }
}

export const mockApi = {
  // auth
  signIn: async (email: string, password: string) => {
    await delay(1000);
    return { success: true, user: { id: "1", name: "Kit Jones", email } };
  },

  signUp: async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    accessCode: string
  ) => {
    await delay(1000);
    if (accessCode !== "STASHY2025") {
      return { success: false, error: "Invalid access code" };
    }
    return { success: true, user: { id: "1", name: `${firstName} ${lastName}`, email } };
  },

  forgotPassword: async (email: string) => {
    await delay(1500);
    return { success: true, message: "Reset link sent" };
  },

  getUserFiles: async () => {
    await delay(800);
    const data = getStoredData();
    // only return top level folders (no parent)
    return {
      folders: data.folders.filter((f: any) => !f.parentId),
      files: data.files.filter((f: any) => !f.folderId),
    };
  },

  getFolderContents: async (folderId: string) => {
    await delay(800);

    const data = getStoredData();
    const folder = data.folders.find(function (f: any) {
      return f.id === folderId;
    });

    // convert folder id to readable name if folder not found
    const folderName =
      folder?.name ||
      folderId
        .split("-")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");

    // build breadcrumb trail by walking up parent chain
    const breadcrumbs = [];
    let currentFolder = folder;

    while (currentFolder) {
      breadcrumbs.unshift({
        id: currentFolder.id,
        name: currentFolder.name,
      });

      // find parent folder
      if (currentFolder.parentId) {
        currentFolder = data.folders.find(function (f: any) {
          return f.id === currentFolder.parentId;
        });
      } else {
        currentFolder = null;
      }
    }

    // get subfolders within this folder
    const subfolders = data.folders.filter(function (f: any) {
      return f.parentId === folderId;
    });

    // get files within this folder
    const folderFiles = data.files.filter(function (f: any) {
      return f.folderId === folderId;
    });

    return {
      folder: { id: folderId, name: folderName, fileCount: folderFiles.length + subfolders.length },
      folders: subfolders,
      files: folderFiles,
      breadcrumbs: breadcrumbs, // add breadcrumb trail
    };
  },

  uploadFile: async (file: File, folderId?: string) => {
    await delay(2000);

    const data = getStoredData();

    // figure out file type from extension
    const fileType = getFileType(file.name);

    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      type: fileType,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      modified: new Date().toISOString().split("T")[0],
      folderId: folderId || null,
    };

    data.files.push(newFile);
    saveStoredData(data);

    return {
      success: true,
      file: newFile,
    };
  },

  createFolder: async (name: string, parentId?: string) => {
    await delay(1000);

    const data = getStoredData();

    const newFolder = {
      id: `${parentId ? `${parentId}-` : ""}${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name,
      fileCount: 0,
      parentId: parentId || null, // set parent folder if provided
    };

    data.folders.push(newFolder);
    saveStoredData(data);

    return { success: true, folder: newFolder };
  },

  deleteItem: async (id: string, type: "file" | "folder") => {
    await delay(800);

    const data = getStoredData();

    if (type === "folder") {
      // also delete all subfolders and files within this folder
      const deleteRecursive = (folderId: string) => {
        // delete files in this folder
        data.files = data.files.filter((f: any) => f.folderId !== folderId);

        // find and delete subfolders
        const subfolders = data.folders.filter((f: any) => f.parentId === folderId);
        subfolders.forEach((subfolder: any) => deleteRecursive(subfolder.id));

        // felete the folder itself
        data.folders = data.folders.filter((f: any) => f.id !== folderId);
      };

      deleteRecursive(id);
    } else {
      data.files = data.files.filter((f: any) => f.id !== id);
    }

    saveStoredData(data);

    return { success: true, message: `${type} deleted successfully` };
  },

  // user storage
  getStorageInfo: async () => {
    await delay(500);
    return {
      used: 82,
      total: 100,
      usedGB: 8.2,
      totalGB: 10,
    };
  },
};

// helper to simulate network delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// helper function to determine file type from extension
function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  const audioExts = ["mp3", "wav", "flac", "aac", "m4a", "ogg"];
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExts = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];
  const docExts = ["pdf", "doc", "docx", "txt", "rtf", "odt"];

  if (ext && audioExts.includes(ext)) return "audio";
  if (ext && imageExts.includes(ext)) return "image";
  if (ext && videoExts.includes(ext)) return "video";
  if (ext && docExts.includes(ext)) return "document";

  return "document";
}
