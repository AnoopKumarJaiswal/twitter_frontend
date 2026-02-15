import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Post from "./Post";

const Profile = () => {
  const userData = useSelector((store) => store.user.data)

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
  } = userData;

  // console.log(userData.post)

  const nav = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fade-in">

      {/* Profile Header Card */}
      <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 shadow-2xl shadow-black/20 relative overflow-hidden">
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

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
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

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => nav("/profile/edit")}
              className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                nav("/changepassword")
              }}
              className="flex-1 md:flex-none px-6 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all duration-300">
              Change Password
            </button>
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
              username={username}
              _id={item._id}
              profilePicture={profilePicture}
              firstName={firstName}
              lastName={lastName}
              createdAt={item.createdAt}
              caption={item.caption}
              img={item.img}
              likes={item.likes}
              comments={item.comments}
              loggedInUserId={_id}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
            <p className="text-slate-500 text-lg">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
