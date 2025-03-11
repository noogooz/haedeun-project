import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// ✅ Firestore에 대화 저장
export const saveMessageToFirestore = async (userId, role, content) => {
  await addDoc(collection(db, "chatbotMessages"), {
    userId, // 유저별 저장
    role,
    content,
    timestamp: new Date(),
  });
};

// ✅ Firestore에서 이전 대화 불러오기
export const getPreviousMessages = async (userId) => {
  const q = query(
    collection(db, "chatbotMessages"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};
