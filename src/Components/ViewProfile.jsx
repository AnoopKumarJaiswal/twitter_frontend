import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUtilContext } from "../utils/UtilContext";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../utils/userSlice";
import Post from "./Post";
import DOMAIN from "../constants";
import Loader from "./Loder";


const formatIST = (isoString) => {
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

const ViewProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [showError, setShowError] = useState(false);
  const nav = useNavigate()

  const loggedInUser = useSelector((store) => store.user.data) || {};
  const {
    following: loggedInUserKaFollowing = [],
    _id: loggedInUserKaId = "",
  } = loggedInUser;

  const {
    firstName = "",
    lastName = "",
    username = "",
    profilePicture = "",
    bio = "",
    followers = [],
    following = [],
    post = [],
    _id = "",
  } = user;

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await axios.get(
          DOMAIN + "/profile/" + id,
          { withCredentials: true }
        );
        setUser(res.data.data);
      } catch (error) {
        setShowError(true);
      }
    }
    getUserData();
  }, [id,]);

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fade-in group">
      {firstName ? (
        <>
          {/* Profile Header Card */}
          <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 shadow-2xl shadow-black/20 relative overflow-hidden mt-6">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 -z-10"></div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
              <img
                src={
                  profilePicture ||
                  "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
                }
                className="relative w-36 h-36 rounded-full object-cover border-4 border-slate-900 shadow-xl"
              />
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">
                {firstName} {lastName}
              </h3>
              <p className="text-blue-400 font-medium mb-4">@{username}</p>

              <p className="text-slate-300 text-lg mb-6 max-w-lg leading-relaxed">{bio || "No bio available"}</p>

              <div className="flex flex-wrap md:flex-nowrap justify-around md:justify-start gap-4 md:gap-8 mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 w-full md:w-auto">
                <div className="flex flex-col items-center px-2 md:px-4">
                  <span className="text-xl md:text-2xl font-bold text-white">{post.length}</span>
                  <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">Posts</span>
                </div>
                <div className="hidden md:block w-px bg-slate-700/50"></div>
                <div className="flex flex-col items-center px-2 md:px-4">
                  <span className="text-xl md:text-2xl font-bold text-white">{followers.length}</span>
                  <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">Followers</span>
                </div>
                <div className="hidden md:block w-px bg-slate-700/50"></div>
                <div className="flex flex-col items-center px-2 md:px-4">
                  <span className="text-xl md:text-2xl font-bold text-white">{following.length}</span>
                  <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">Following</span>
                </div>
              </div>


              <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start">
                {loggedInUserKaFollowing.includes(id) ? (
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={() => {
                        axios
                          .patch(
                            DOMAIN +
                            `/profile/unfollow/${id}`,
                            null,
                            { withCredentials: true }
                          )
                          .then(() => {
                            followers.pop()
                            dispatch(unfollowUser(id));
                          });
                      }}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 hover:text-white hover:border-red-500/50 transition-all duration-300 shadow-lg shadow-black/20"
                    >
                      Unfollow
                    </button>

                    <button onClick={() => {
                      nav(`/chat/${id}`)
                    }} className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
                      Message
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      axios
                        .patch(
                          DOMAIN +
                          `/profile/follow/${id}`,
                          null,
                          { withCredentials: true }
                        )
                        .then(() => {
                          followers.push("oertyu")
                          dispatch(followUser(id));
                        });
                    }}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800 w-full mb-10"></div>

          <h2 className="text-2xl font-bold text-white mb-8 px-4 border-l-4 border-blue-500">Recent Posts</h2>

          <div className="space-y-8">
            {post.length > 0 ? (
              post.map((item) => (
                <Post
                  key={item._id}
                  likes={item.likes}
                  comments={item.comments}
                  img={item.img}
                  firstName={firstName}
                  lastName={lastName}
                  username={username}
                  caption={item.caption}
                  _id={item._id}
                  profilePicture={profilePicture}
                  createdAt={item.createdAt}
                  loggedInUserId={loggedInUserKaId}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-regular fa-folder-open text-2xl text-slate-500"></i>
                </div>
                <p className="text-slate-500 text-lg">No posts yet</p>
              </div>
            )}
          </div>
        </>
      ) : showError ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
          <h1 className="text-2xl font-bold text-slate-200">User Not Found</h1>
          <p className="text-slate-500 mt-2">The profile you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
