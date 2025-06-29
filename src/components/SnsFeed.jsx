import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  increment, // increment를 import 해야 합니다.
} from "firebase/firestore";
import { postNewStatus } from "../utils/snsUtils";
import { updateAffinity } from "../utils/affinityUtils";
import { getUserId } from "../utils/getUserId"; // ✨ 1. '통합 신분증'을 import 합니다.
import "./SnsFeed.css";

export default function SnsFeed() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const userId = getUserId(); // ✨ 2. 통합 ID 함수를 사용합니다.

  useEffect(() => {
    const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribes = posts.map(post => {
      const commentsRef = collection(db, `snsPosts/${post.id}/comments`);
      const q = query(commentsRef, orderBy("timestamp", "asc"));
      return onSnapshot(q, (snapshot) => {
        setComments(prev => ({ ...prev, [post.id]: snapshot.docs.map(d => ({id: d.id, ...d.data()})) }));
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [posts]);

  // ✨ 3. 파일 내부에 있던 별도의 getUserId 함수를 완전히 삭제했습니다.

  const handleLike = async (postId, authorName) => {
    const postRef = doc(db, "snsPosts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedUsers = postData.likedUsers || [];
      if (!likedUsers.includes(userId)) {
        await updateDoc(postRef, {
          likes: increment(1),
          likedUsers: [...likedUsers, userId]
        });
        await updateAffinity(userId, authorName, 1);
      }
    }
  };
  
  // ✅ 기존 댓글 등록 기능 (getUserId()만 수정)
  const handleCommentSubmit = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    const commentsRef = collection(db, `snsPosts/${postId}/comments`);
    await addDoc(commentsRef, {
      userId: userId,
      text: newComment[postId],
      timestamp: serverTimestamp(),
    });
    setNewComment(prev => ({ ...prev, [postId]: "" }));

    // ✅ 기존 햇님이 자동 답글 기능 (그대로 유지)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        addDoc(commentsRef, {
          userId: "햇님이", text: getHatnimeeReply(), timestamp: serverTimestamp(),
        });
      }, 2000);
    }
  };

  // ✅ 기존 햇님이 답글 목록 기능 (그대로 유지)
  const getHatnimeeReply = () => {
    const replies = [
      "정말 좋은 생각이야! 😊", "오! 나도 그렇게 생각해! ✨", "그건 나도 궁금해! 🤔",
      "좋은 하루 보내! ☀️", "우와! 재밌겠다! 🎉", "나도 해보고 싶어! 🌟",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // ✅ 기존 시간 계산 함수 (그대로 유지)
  const timeAgo = (timestamp) => {
    if (!timestamp?.seconds) return "방금 전";
    const diff = Math.floor((new Date() - new Date(timestamp.seconds * 1000)) / 1000 / 60);
    if (diff < 1) return "방금 전";
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  };

  return (
    <div className="sns-container">
      <h2 className="sns-title"> SNS</h2>
      <div className="sns-feed">
        {posts.map((post) => (
          <div key={post.id} className="sns-post">
            <div className="post-header">
              <img src={post.profileImage || "/images/hatnim-profile.png"} alt="프로필" className="sns-profile-pic" />
              <div>
                <p className="post-author">{post.author}</p>
                <p className="post-time">{timeAgo(post.timestamp)}</p>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button onClick={() => handleLike(post.id, post.author)} className="like-button" disabled={post.likedUsers?.includes(userId)}>
                {post.likedUsers?.includes(userId) ? "❤️" : "🤍"} {post.likes || 0}
              </button>
            </div>
            <div className="comments-section">
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.userId === "햇님이" ? "🌞 햇님이" : (comment.userId === userId ? "🧑‍💻 나" : "🧑‍💻 사용자")}</strong>: {comment.text}
                </div>
              ))}
              <div className="comment-input">
                <input type="text" placeholder="댓글을 입력하세요..." value={newComment[post.id] || ""} onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}/>
                <button onClick={() => handleCommentSubmit(post.id)}>💬 등록</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}