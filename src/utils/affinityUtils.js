import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";

/**
 * 특정 사용자의 호감도 변경을 실시간으로 감지하고 콜백 함수를 실행합니다.
 * @param {string} userId - 사용자 ID
 * @param {function} callback - 데이터가 변경될 때마다 실행될 콜백 함수
 * @returns {function} - 리스너를 정리하는 unsubscribe 함수
 */
export const listenToAffinity = (userId, callback) => {
  if (!userId) return () => {};

  const userAffinityRef = doc(db, "affinity", userId);
  
  const unsubscribe = onSnapshot(userAffinityRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({});
    }
  });

  return unsubscribe;
};

/**
 * 특정 캐릭터의 호감도를 증가시키는 함수 (수정됨: 더 안전하고 확실한 방식)
 * @param {string} userId - 사용자 ID
 * @param {string} characterName - 캐릭터 이름
 * @param {number} points - 증가시킬 점수
 */
export const updateAffinity = async (userId, characterName, points) => {
  if (!userId || !characterName || !points) return;

  const userAffinityRef = doc(db, "affinity", userId);
  const safeCharacterName = characterName.replace(/\./g, "_");

  try {
    // ✨ [수정] setDoc과 { merge: true } 옵션을 사용하여,
    // 문서(집)가 없으면 자동으로 생성하고, 있으면 기존 문서에 필드를 추가/업데이트합니다.
    // increment()는 기존 점수에 points를 안전하게 더해줍니다.
    await setDoc(userAffinityRef, {
      [safeCharacterName]: increment(points)
    }, { merge: true });

    console.log(`[호감도 시스템] ${userId}가 ${safeCharacterName}에게 ${points}점 획득!`);
  } catch (error) {
    console.error("호감도 업데이트 실패:", error);
  }
};

// getAffinity 함수는 현재 사용되지 않지만, 만약을 위해 남겨둡니다.
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