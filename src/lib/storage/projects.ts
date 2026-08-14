import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase";

export async function uploadProjectImage(
  file: File,
  projectId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!storage || !isFirebaseConfigured()) {
    throw new Error("Firebase Storage is not configured. Please check environment variables.");
  }

  const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `project-images/${projectId}/${Date.now()}_${cleanFilename}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(percent);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function deleteProjectImage(imageUrl: string): Promise<void> {
  if (!storage || !isFirebaseConfigured() || !imageUrl) return;

  // Only attempt deletion if it is a Firebase Storage URL
  if (!imageUrl.includes("firebasestorage.googleapis.com")) return;

  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Could not delete previous storage image:", error);
  }
}
