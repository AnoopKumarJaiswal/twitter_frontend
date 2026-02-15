import React, { useEffect, useState } from "react";
import { updateLikes } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import DOMAIN from "../constants";


const formatIST = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Post = ({
  profilePicture,
  firstName,
  lastName,
  createdAt,
  caption,
  img,
  likes,
  comments,
  _id,
  loggedInUserId,
  username,
}) => {
  const dispatch = useDispatch();

  // SAFETY WRAPS
  const safeLikes = Array.isArray(likes)
    ? likes.map((x) => (typeof x === "string" ? x : x?._id))
    : [];

  const safeComments = Array.isArray(comments) ? comments : [];
  const [commentList, setCommentList] = useState(safeComments)
  const [likedByUser, setLikedByUser] = useState(safeLikes);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal,]);

  const userHasLiked = likedByUser.includes(loggedInUserId);

  const handleLike = () => {
    axios
      .patch(
        `${DOMAIN}/posts/like/${_id}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(updateLikes(res.data.data));
        setLikedByUser([...likedByUser, loggedInUserId]);
      })
      .catch(() => toast.error("Error liking post"));
  };

  const handleUnlike = () => {
    axios
      .patch(
        `${DOMAIN}/posts/unlike/${_id}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(updateLikes(res.data.data));
        setLikedByUser(likedByUser.filter((id) => id !== loggedInUserId));
      })
      .catch(() => toast.error("Error unliking post"));
  };

  const handleComment = () => {
    if (!text.trim()) return;

    axios
      .post(
        `${DOMAIN}/comments/${_id}`,
        { text },
        { withCredentials: true }
      )
      .then((res) => {
        setCommentList(prev => [...prev, res.data.data.comment])
        toast.success("Comment added");
        setText("");
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card w-full max-w-xl mx-auto rounded-3xl p-6 mb-8 relative hover:border-slate-600/50 transition-all duration-300 group">

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-fade-in">
            <span
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-7 text-white/50 hover:text-white text-3xl cursor-pointer transition-colors"
            >
              ✕
            </span>

            <div
              className={`bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden h-[85vh] max-w-[1000px] flex shadow-2xl shadow-blue-900/20 ${img ? "w-[85vw]" : "w-[500px]"
                }`}
            >
              {img && (
                <div className="w-[65%] bg-black flex items-center justify-center">
                  <img src={img} className="max-w-full max-h-full object-contain" />
                </div>
              )}

              <div className={`${img ? "w-[35%]" : "w-full"} flex flex-col border-l border-slate-800`}>
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
                  <img className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-700" src={profilePicture} />
                  <p className="font-semibold text-slate-200">@{username}</p>
                </div>

                <div className="px-5 py-4 text-sm text-slate-300 leading-relaxed border-b border-slate-800/50">
                  {caption}
                </div>

                {/* COMMENTS */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {commentList.map((item) => {
                      if (!item || !item.author) return null;

                      return (
                        <div key={item._id} className="flex items-start gap-3 group/comment">
                          <img
                            src={item.author?.profilePicture}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div className="bg-slate-800/50 rounded-2xl px-3 py-2">
                            <p className="text-slate-100">
                              <span className="font-semibold text-blue-400 mr-2">
                                @{item.author?.username}
                              </span>
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD COMMENT */}
                  <div className="px-4 py-4 border-t border-slate-800 flex items-center gap-3 bg-slate-900/50">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button onClick={handleComment} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors px-2">
                      Post
                    </button>
                  </div>
                </div>

                {/* LIKE SECTION IN MODAL */}
                <div className="px-4 py-3 flex items-center gap-4 text-slate-400 border-t border-slate-800 bg-slate-900/30">
                  {userHasLiked ? (
                    <i
                      className="fa-solid fa-heart text-pink-500 text-xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={handleUnlike}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-heart text-xl cursor-pointer hover:text-pink-500 hover:scale-110 transition-all"
                      onClick={handleLike}
                    ></i>
                  )}
                  <span className="font-medium">{likedByUser.length} likes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
            <img src={profilePicture || "data:image/png;base64,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"} className="relative w-12 h-12 rounded-full object-cover border-2 border-slate-900" />
          </div>
          <div>
            <p className="font-bold text-slate-100 text-lg tracking-wide group-hover:text-blue-400 transition-colors">
              {firstName} {lastName}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-blue-400 font-medium">@{username}</p>
              <span className="text-slate-600 text-[10px]">•</span>
              <p className="text-xs text-slate-500">{formatIST(createdAt)}</p>
            </div>
          </div>
        </div>

        {caption && <p className="mt-4 text-slate-300 text-[15px] leading-7 font-light">{caption}</p>}

        {img && (
          <div className="mt-5 rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-slate-700/30">
            <img
              src={img}
              className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* LIKE + COMMENT BUTTONS */}
        <div className="flex items-center gap-8 mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 cursor-pointer group/like">
            {userHasLiked ? (
              <i
                className="fa-solid fa-heart text-pink-500 text-xl group-hover/like:scale-125 transition-transform"
                onClick={handleUnlike}
              ></i>
            ) : (
              <i
                className="fa-regular fa-heart text-xl text-slate-400 group-hover/like:text-pink-500 group-hover/like:scale-125 transition-transform"
                onClick={handleLike}
              ></i>
            )}
            <span className={`text-sm font-medium transition-colors ${userHasLiked ? 'text-pink-500' : 'text-slate-400 group-hover/like:text-pink-400'}`}>{likedByUser.length}</span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer group/comment"
            onClick={() => setShowModal(true)}
          >
            <i className="fa-regular fa-comment text-xl text-slate-400 group-hover/comment:text-blue-400 group-hover/comment:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-slate-400 group-hover/comment:text-blue-400 transition-colors">{commentList.length}</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer group/share ml-auto">
            <i className="fa-regular fa-paper-plane text-xl text-slate-400 group-hover/share:text-green-400 group-hover/share:-translate-y-1 group-hover/share:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Post;
