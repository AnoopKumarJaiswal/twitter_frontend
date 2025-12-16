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
    <div className="w-full max-w-3xl mx-auto p-6 h-[90vh] ">
      <div className="flex items-start gap-6">
        <img
          src={
            profilePicture ||
            "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
          }
          className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-sm"
        />

        <div className="flex-1 flex flex-col">
          <h3 className="text-2xl font-semibold">
            {firstName} {lastName}
          </h3>
          <p>@{username}</p>

          <div className="flex gap-6 mt-3">
            <span>{post.length} Posts</span>
            <span>{followers.length} Followers</span>
            <span>{following.length} Following</span>
          </div>

          <p className="mt-3 text-gray-700">{bio}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => nav("/profile/edit")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="h-[80px]"></div>

      {post.length > 0 &&
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
        ))}
    </div>
  );
};

export default Profile;
