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
  likes = [],
  comments = [],
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

  const [likedByUser, setLikedByUser] = useState(safeLikes);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

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
      .then(() => {
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
                    {safeComments.map((item) => {
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
          <img src={profilePicture} className="w-10 h-10 rounded-full" />
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
            <span>{safeComments.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Post;
