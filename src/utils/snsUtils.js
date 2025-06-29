import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
  limit, // limit을 import에 추가해야 합니다.
} from "firebase/firestore";

// ✨ 1. 캐릭터 정보 배열
const charactersForSns = [
    { name: "햇님이", profileImage: "/images/hatnim-profile.png", messages: ["오늘 날씨 최고! 다들 즐거운 하루 보내! ☀️", "새로운 마법 배우는 중! 너무 신나! 💪"] },
    { name: "달님이", profileImage: "/images/dalnim.png", messages: ["고요한 밤, 떠오르는 생각의 조각들.", "오늘 밤 유독 별이 밝네."] },
    { name: "별님이", profileImage: "/images/byulnim.png", messages: ["흥, 시끄러운 건 딱 질색이야.", "…별이나 보고 싶은 밤이네."] },
    { name: "트링이", profileImage: "/images/tringi.png", messages: ["오늘 새로 덖은 찻잎의 향기가 정말 좋아. 숲의 향기가 가득. 🍵", "마음이 복잡할 땐 따뜻한 차 한 잔 어때?"] },
    { name: "구르미", profileImage: "/images/gurumi.png", messages: ["구름 위에서 낮잠 자는 것만큼 좋은 건 없지~ ☁️", "오늘은 어디로 흘러가 볼까나~"] },
    { name: "썬더", profileImage: "/images/thunder.png", messages: ["가만히 있는 건 좀이 쑤셔! 지금 당장 달려 나갈 사람! ⚡", "1분 1초가 아깝다! 뭐든 해보자고!"] },
    { name: "토피트", profileImage: "/images/topite.png", messages: ["모두 모두 사랑해! 내 마음을 받아줘! 💖", "히힛~ 오늘따라 더 보고 싶네~?"] },
    { name: "루트", profileImage: "/images/root.png", messages: ["오늘 숲에서 새로운 새싹이 돋아났어. 작은 생명의 경이로움. 🌱", "나무처럼, 서두르지 말고 단단하게."] }
];


// ✅ Firestore에서 최근 게시물 시간 가져오기
const getLastPostTime = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().timestamp?.toMillis() : null;
};

// ✅ Firestore에서 가장 최근 게시물 내용 가져오기
export const getLastPost = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? snapshot.docs[0].data().content : null;
};

// ✅ Firestore에서 게시물 개수 확인 후 오래된 게시물 삭제
const managePostLimit = async () => {
  const q = query(collection(db, "snsPosts"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  const posts = snapshot.docs;

  if (posts.length >= 20) {
    await deleteDoc(doc(db, "snsPosts", posts[0].id));
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
    isPosting = true;

    const lastPostTime = await getLastPostTime();
    const now = new Date();
    const minInterval = 2 * 60 * 60 * 1000;

    if (lastPostTime && now.getTime() - lastPostTime < minInterval) {
      console.log("⏳ 아직 게시물을 올릴 시간이 아님!");
      isPosting = false;
      return;
    }

    // ✨ 랜덤으로 캐릭터와 메시지 선택
    const randomCharacter = charactersForSns[Math.floor(Math.random() * charactersForSns.length)];
    let newStatus;
    const lastPostContent = await getLastPost();

    // 중복되지 않는 메시지가 나올 때까지 반복
    do {
      newStatus = randomCharacter.messages[Math.floor(Math.random() * randomCharacter.messages.length)];
    } while (newStatus === lastPostContent);


    await managePostLimit();

    // ✨ 선택된 캐릭터의 정보로 새로운 게시글 추가
    const newPostRef = await addDoc(collection(db, "snsPosts"), {
      author: randomCharacter.name,
      content: newStatus,
      timestamp: serverTimestamp(),
      profileImage: randomCharacter.profileImage,
      likes: 0,
      likedUsers: [], // 좋아요 누른 사용자 배열 초기화
    });

    console.log(`📢 [${randomCharacter.name} SNS] 새로운 게시글: "${newStatus}"`);

    // ✅ **게시글이 생성되면 자동으로 comments 컬렉션을 추가
    await setDoc(doc(db, `snsPosts/${newPostRef.id}/comments`, "placeholder"), {
      text: "댓글을 남겨보세요!",
      timestamp: serverTimestamp(),
    });

    console.log(`📝 [댓글 자동 생성] ${newPostRef.id} 게시글에 comments 컬렉션 생성!`);

    isPosting = false;

    // ⏳ **다음 게시글 업로드 간격 랜덤 설정 (기존 로직 유지)**
    const nextPostDelay = Math.random() * (28800000 - 10800000) + 10800000;
    setTimeout(postNewStatus, nextPostDelay);

  } catch (error) {
    console.error("🚨 Firestore에 게시물 추가 실패:", error);
    isPosting = false;
  }
};