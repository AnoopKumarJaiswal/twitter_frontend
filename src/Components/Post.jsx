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
  likes ,
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
        setCommentList(prev => [...prev , res.data.data.comment])
        toast.success("Comment added");
        setText("");
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  return (
    <div>
      <div className="bg-white w-full max-w-xl mx-auto rounded-2xl shadow-lg p-4 mb-10 relative">

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center">
            <span
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-7 text-white text-3xl cursor-pointer"
            >
              ✕
            </span>

            <div
              className={`bg-white rounded-lg overflow-hidden h-[85vh] max-w-[1000px] flex ${
                img ? "w-[85vw]" : "w-[500px]"
              }`}
            >
              {img && (
                <div className="w-[65%] bg-black">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              )}

              <div className={`${img ? "w-[35%]" : "w-full"} flex flex-col`}>
                <div className="flex items-center gap-3 px-4 h-[60px]">
                  <img className="h-9 w-9 rounded-full" src={profilePicture} />
                  <p className="font-semibold">@{username}</p>
                </div>

                <p className="px-4 text-sm">{caption}</p>

                {/* COMMENTS */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm">
                    {commentList.map((item) => {
                      if (!item || !item.author) return null;

                      return (
                        <div key={item._id} className="flex items-start gap-3">
                          <img
                            src={item.author?.profilePicture}
                            className="h-8 w-8 rounded-full"
                          />
                          <p>
                            <span className="font-semibold">
                              @{item.author?.username}{" "}
                            </span>
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD COMMENT */}
                  <div className="px-4 py-3 flex items-center gap-2">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2"
                    />
                    <button onClick={handleComment} className="text-blue-500">
                      Post
                    </button>
                  </div>
                </div>

                {/* LIKE SECTION IN MODAL */}
                <div className="px-4 py-3 flex items-center gap-3">
                  {userHasLiked ? (
                    <i
                      className="fa-solid fa-heart text-red-600 text-xl cursor-pointer"
                      onClick={handleUnlike}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-heart text-xl cursor-pointer"
                      onClick={handleLike}
                    ></i>
                  )}

                  <span>{likedByUser.length} likes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <img src={profilePicture || "data:image/png;base64,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"} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-gray-500">{formatIST(createdAt)}</p>
          </div>
        </div>

        {caption && <p className="mt-3 text-gray-700 text-sm">{caption}</p>}

        {img && (
          <img
            src={img}
            className="mt-4 rounded-xl w-full max-h-80 object-cover"
          />
        )}

        {/* LIKE + COMMENT BUTTONS */}
        <div className="flex items-center gap-6 mt-4 text-gray-600">
          <div className="flex items-center gap-1 cursor-pointer">
            {userHasLiked ? (
              <i
                className="fa-solid fa-heart text-red-600 text-xl"
                onClick={handleUnlike}
              ></i>
            ) : (
              <i
                className="fa-regular fa-heart text-xl"
                onClick={handleLike}
              ></i>
            )}
            <span>{likedByUser.length}</span>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            💬
            <span>{commentList.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Post;
