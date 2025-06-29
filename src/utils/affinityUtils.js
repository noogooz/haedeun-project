import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

/**
 * 특정 캐릭터의 현재 호감도 점수를 가져오는 함수
 * @param {string} userId - 사용자 ID
 * @param {string} characterName - 캐릭터 이름
 * @returns {Promise<number>} - 현재 호감도 점수
 */
export const getAffinity = async (userId, characterName) => {
  if (!userId || !characterName) return 0;

  const userAffinityRef = doc(db, "affinity", userId);
  const userAffinitySnap = await getDoc(userAffinityRef);

  if (userAffinitySnap.exists()) {
    const affinities = userAffinitySnap.data();
    return affinities[characterName] || 0;
  }

  return 0;
};

/**
 * 특정 캐릭터의 호감도를 증가시키는 함수
 * @param {string} userId - 사용자 ID
 * @param {string} characterName - 캐릭터 이름
 * @param {number} points - 증가시킬 점수
 */
export const updateAffinity = async (userId, characterName, points) => {
  if (!userId || !characterName || !points) return;

  const userAffinityRef = doc(db, "affinity", userId);
  const userAffinitySnap = await getDoc(userAffinityRef);

  const safeCharacterName = characterName.replace(/\./g, "_");

  try {
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