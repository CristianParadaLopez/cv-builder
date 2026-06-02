import {
  collection, addDoc, getDocs,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "../../firebase/config";

export interface SavedCV {
  id: string;
  title: string;
  html: string;
  formData: any;
  createdAt: any;
}

// Limpia undefined recursivamente para que Firestore no lo rechace
function cleanUndefined(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) return obj.map(cleanUndefined);
  if (typeof obj === "object") {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = cleanUndefined(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

export async function saveCV(
  userId: string,
  html: string,
  formData: any
): Promise<string> {
  const ref = collection(db, "users", userId, "cvs");
  const cleanedFormData = cleanUndefined(formData ?? {});
  const docRef = await addDoc(ref, {
    title: cleanedFormData?.name || "Mi CV",
    html,
    formData: cleanedFormData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserCVs(userId: string): Promise<SavedCV[]> {
  const ref = collection(db, "users", userId, "cvs");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SavedCV, "id">),
  }));
}

export async function deleteCV(userId: string, cvId: string): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "cvs", cvId));
}