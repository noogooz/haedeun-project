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
} from "firebase/firestore";
import { postNewStatus } from "../utils/snsUtils";
import { updateAffinity } from "../utils/affinityUtils";
import { getUserId } from "../utils/getUserId"; // ✨ 통합 ID 함수를 import 합니다.
import "./SnsFeed.css";

export default function SnsFeed() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    const q = query(collection(db, "snsPosts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
      if (postList.length > 0) {
        const lastPostTime = postList[0].timestamp?.toMillis();
        const now = Date.now();
        const minInterval = 2 * 60 * 60 * 1000;
        if (lastPostTime && now - lastPostTime >= minInterval) {
          await postNewStatus();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeMap = {};
    posts.forEach((post) => {
      const commentsRef = collection(db, `snsPosts/${post.id}/comments`);
      const q = query(commentsRef, orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComments((prevComments) => ({
          ...prevComments,
          [post.id]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
      });
      unsubscribeMap[post.id] = unsubscribe;
    });
    return () => {
      Object.values(unsubscribeMap).forEach((unsub) => unsub());
    };
  }, [posts]);

  const handleLike = async (postId, authorName) => {
    const userId = getUserId(); // ✨ 통합 ID 함수를 사용합니다.
    const postRef = doc(db, "snsPosts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const post = postSnap.data();
      const likes = post.likes || 0;
      const likedUsers = post.likedUsers || [];

      if (!likedUsers.includes(userId)) {
        await updateDoc(postRef, {
          likes: likes + 1,
          likedUsers: [...likedUsers, userId],
        });
        await updateAffinity(userId, authorName, 1);
      }
    }
  };
  
  const handleCommentSubmit = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    const commentsRef = collection(db, `snsPosts/${postId}/comments`);
    await addDoc(commentsRef, {
      userId: getUserId(), // ✨ 통합 ID 함수를 사용합니다.
      text: newComment[postId],
      timestamp: serverTimestamp(),
    });
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    if (Math.random() < 0.3) {
      setTimeout(() => {
        addDoc(commentsRef, {
          userId: "햇님이", text: getHatnimeeReply(), timestamp: serverTimestamp(),
        });
      }, 2000);
    }
  };

  const getHatnimeeReply = () => {
    const replies = ["정말 좋은 생각이야! 😊", "오! 나도 그렇게 생각해! ✨", "그건 나도 궁금해! 🤔", "좋은 하루 보내! ☀️", "우와! 재밌겠다! 🎉", "나도 해보고 싶어! 🌟"];
    return replies[Math.floor(Math.random() * replies.length)];
  };

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
              <button onClick={() => handleLike(post.id, post.author)} className="like-button" disabled={post.likedUsers?.includes(getUserId())}>
                {post.likedUsers?.includes(getUserId()) ? "❤️" : "🤍"} {post.likes || 0}
              </button>
            </div>
            <div className="comments-section">
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.userId === "햇님이" ? "🌞 햇님이" : "🧑‍💻 사용자"}</strong>: {comment.text}
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