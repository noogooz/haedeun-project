import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";

const statusMessages = [
  "오늘은 카페에서 책 읽는 중~ 📖☕",
  "학교에서 수업 듣는 중.. 졸리다 😴",
  "집에서 음악 듣는 중~ 🎶",
  "기차역에서 사람 구경하는 중 🚉",
  "하늘섬에서 바람 맞는 중~ 🌬️✨",
  "친구랑 수다 떨고 있어! 📱💬",
  "방에서 게임하는 중! 🎮",
  "별을 보면서 생각에 잠겼어 🌌",
  "운동하러 나왔어! 몸이 상쾌하다 💪",
  "새로운 곳을 탐험하는 중! 모험가 느낌이야! 🗺️",
];

// ✅ Firestore에서 최근 게시물 시간 가져오기
const getLastPostTime = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().timestamp?.toMillis() : null;
};

// ✅ Firestore에서 게시물 개수 확인 후 오래된 게시물 삭제
const managePostLimit = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "asc")); // 가장 오래된 게시물부터 가져오기
  const snapshot = await getDocs(q);
  const posts = snapshot.docs;

  if (posts.length >= 20) {
    await deleteDoc(posts[0].ref); // 가장 오래된 게시물 삭제
    console.log("🗑️ 오래된 게시물 삭제 완료");
  }
};

// ✅ Firestore에서 가장 최근 게시물 내용 가져오기
export const getLastPost = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().content : null;
};

// ✅ 중복 방지 플래그 추가
let isPosting = false;

export const postNewStatus = async () => {
  if (isPosting) {
    console.log("⏳ 이미 게시물을 올리는 중입니다. 중복 실행 방지!");
    return;
  }

  try {
    isPosting = true; // 🚀 실행 시작

    const lastPostTime = await getLastPostTime();
    const now = Date.now();
    const minInterval = 2 * 60 * 60 * 1000; // 최소 2시간 (7200000ms)

    if (lastPostTime && now - lastPostTime < minInterval) {
      console.log("⏳ 아직 게시물을 올릴 시간이 아님!");
      isPosting = false;
      return;
    }

    // 🔄 중복되지 않는 새로운 상태 메시지 선택
    let newStatus;
    let lastPostContent = await getLastPost();
    do {
      newStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    } while (newStatus === lastPostContent);

    await managePostLimit(); // ✅ 게시물 개수 관리

    // 📝 Firestore에 새로운 게시글 추가
    const newPostRef = await addDoc(collection(db, "snsPosts"), {
      author: "햇님이",
      content: newStatus,
      timestamp: serverTimestamp(),
      profileImage: "/images/hatnim-profile.png",
      likes: 0,
    });

    console.log(`📢 [햇님이 SNS] 새로운 게시글: "${newStatus}"`);

    // ✅ **게시글이 생성되면 자동으로 comments 컬렉션을 추가**
    await setDoc(doc(db, `snsPosts/${newPostRef.id}/comments`, "placeholder"), {
      text: "댓글을 남겨보세요!",
      timestamp: serverTimestamp(),
    });

    console.log(`📝 [댓글 자동 생성] ${newPostRef.id} 게시글에 comments 컬렉션 생성!`);

    // ✅ 실행이 끝나면 플래그 해제
    isPosting = false;

    // ⏳ **랜덤 시간 간격 (3~8시간) 후 다음 게시물 업로드**
    const nextPostDelay = Math.random() * (28800000 - 10800000) + 10800000; 
    setTimeout(postNewStatus, nextPostDelay);
  } catch (error) {
    console.error("🚨 Firestore에 게시물 추가 실패:", error);
    isPosting = false;
  }
};
