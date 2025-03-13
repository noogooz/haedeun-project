import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";

// ✅ Firestore에서 최근 게시물 시간 가져오기
const getLastPostTime = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().timestamp?.toMillis() : null;
};

// ✅ Firestore에서 가장 최근 게시물 내용 가져오기
export const getLastPost = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().content : null;
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

// ✅ 중복 방지 플래그 추가
let isPosting = false;

// ✅ **SNS 게시물 자동 생성 함수**
export const postNewStatus = async () => {
  if (isPosting) {
    console.log("⏳ 이미 게시물을 올리는 중입니다. 중복 실행 방지!");
    return;
  }

  try {
    isPosting = true; // 🚀 실행 시작

    const lastPostTime = await getLastPostTime();
    const now = new Date();
    const hour = now.getHours(); // ✅ 현재 시간 가져오기
    const minInterval = 2 * 60 * 60 * 1000; // ✅ 최소 2시간 간격 유지

    if (lastPostTime && now.getTime() - lastPostTime < minInterval) {
      console.log("⏳ 아직 게시물을 올릴 시간이 아님!");
      isPosting = false;
      return;
    }

    // ✅ 시간대별 메시지 설정
    let statusMessages = [];
    if (hour >= 6 && hour < 12) {
      statusMessages = [
        "아침부터 활기차게 시작! ☀️",
        "아침에는 카페에서 커피 한잔! ☕",
        "오늘 하루도 화이팅! 💪",
      ];
    } else if (hour >= 12 && hour < 17) {
      statusMessages = [
        "밥 먹고 나니까 졸리다... 😴",
        "도서관에서 공부 중! 📚",
        "점심시간에 산책 중~ 🚶‍♂️",
      ];
    } else if (hour >= 17 && hour < 21) {
      statusMessages = [
        "친구랑 저녁 먹으러 나왔어! 🍽️",
        "야경 보면서 생각 정리 중... 🌆",
        "하늘섬에서 석양 감상 중... 🌅",
      ];
    } else {
      statusMessages = [
        "이제 슬슬 자야겠다... 💤",
        "밤하늘의 별을 보며 감성에 젖는 중 🌌",
        "늦은 밤, 조용한 시간... 🕰️",
      ];
    }

    // 🔄 중복되지 않는 새로운 상태 메시지 선택
    let newStatus;
    let lastPostContent = await getLastPost();
    do {
      newStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    } while (newStatus === lastPostContent);

    await managePostLimit();

    // 📝 Firestore에 새로운 게시글 추가 (시간대 반영)
    const newPostRef = await addDoc(collection(db, "snsPosts"), {
      author: "햇님이",
      content: `${newStatus}`, // ✅ 시간대 반영 메시지만 게시
      timestamp: serverTimestamp(),
      profileImage: "/images/hatnim-profile.png",
      likes: 0,
    });

    console.log(`📢 [햇님이 SNS] 새로운 게시글: "${newStatus}"`);

    // ✅ **게시글이 생성되면 자동으로 comments 컬렉션을 추가!**
    await setDoc(doc(db, `snsPosts/${newPostRef.id}/comments`, "placeholder"), {
      text: "댓글을 남겨보세요!",
      timestamp: serverTimestamp(),
    });

    console.log(`📝 [댓글 자동 생성] ${newPostRef.id} 게시글에 comments 컬렉션 생성!`);

    isPosting = false;

    // ⏳ **게시글 업로드 간격: 랜덤 3~8시간**
    const nextPostDelay = Math.random() * (28800000 - 10800000) + 10800000;

    setTimeout(postNewStatus, nextPostDelay);
  } catch (error) {
    console.error("🚨 Firestore에 게시물 추가 실패:", error);
    isPosting = false;
  }
};