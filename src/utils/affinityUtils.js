import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";

// ✨ 1. 실시간으로 호감도 변경을 감지하는 새로운 함수
/**
 * 특정 사용자의 호감도 변경을 실시간으로 감지하고 콜백 함수를 실행합니다.
 * @param {string} userId - 사용자 ID
 * @param {function} callback - 데이터가 변경될 때마다 실행될 콜백 함수
 * @returns {function} - 리스너를 정리하는 unsubscribe 함수
 */
export const listenToAffinity = (userId, callback) => {
  if (!userId) return () => {}; // userId가 없으면 아무것도 안 함

  const userAffinityRef = doc(db, "affinity", userId);
  
  // onSnapshot을 사용하여 데이터 변경을 실시간으로 감지
  const unsubscribe = onSnapshot(userAffinityRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data()); // 데이터가 존재하면 콜백 함수에 전체 데이터를 전달
    } else {
      callback({}); // 데이터가 없으면 빈 객체를 전달
    }
  });

  return unsubscribe; // 나중에 리스너를 해제할 수 있도록 unsubscribe 함수를 반환
};


// (기존의 getAffinity와 updateAffinity 함수는 그대로 유지됩니다)

export const getAffinity = async (userId, characterName) => {
  if (!userId || !characterName) return 0;
  const userAffinityRef = doc(db, "affinity", userId);
  const userAffinitySnap = await getDoc(userAffinityRef);
  if (userAffinitySnap.exists()) {
    const affinities = userAffinitySnap.data();
    return affinities[characterName.replace(/\./g, "_")] || 0;
  }
  return 0;
};

export const updateAffinity = async (userId, characterName, points) => {
  if (!userId || !characterName || !points) return;
  const userAffinityRef = doc(db, "affinity", userId);
  const safeCharacterName = characterName.replace(/\./g, "_");
  try {
    const userAffinitySnap = await getDoc(userAffinityRef);
    if (userAffinitySnap.exists()) {
      await updateDoc(userAffinityRef, {
        [safeCharacterName]: increment(points),
      });
    } else {
      await setDoc(userAffinityRef, {
        [safeCharacterName]: points,
      });
    }
    console.log(`[호감도 시스템] ${userId}가 ${safeCharacterName}에게 ${points}점 획득!`);
  } catch (error) {
    console.error("호감도 업데이트 실패:", error);
  }
};