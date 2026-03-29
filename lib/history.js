import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveAnalysis(data, user) {
  if (!user) return;

  try {
    await addDoc(collection(db, "history"), {
      userId: user.uid,
      code: data.code || "",
      result: data.result || null,
      language: data.language || "unknown",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("History save failed:", err);
  }
}

export async function getUserHistory(user) {
  if (!user) return [];

  try {
    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching history:", err);
    return [];
  }
}
