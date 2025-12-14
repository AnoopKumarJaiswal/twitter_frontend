import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUtilContext } from "../utils/UtilContext";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../utils/userSlice";
import Post from "./Post";
import DOMAIN from "../constants";


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
    <div className="w-full max-w-3xl mx-auto p-6 h-[90vh] ">
      {firstName ? (
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
              <h3 className="text-2xl font-semibold text-gray-900">
                {firstName} {lastName}
              </h3>
              <p className="text-gray-500">@{username}</p>

              <div className="flex gap-6 mt-3">
                <span>{post.length} Posts</span>
                <span>{followers.length} Followers</span>
                <span>{following.length} Following</span>
              </div>

              <p className="mt-3 text-gray-700">{bio}</p>

              <div className="flex gap-4 mt-4">
                {loggedInUserKaFollowing.includes(id) ? (
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Unfollow
                  </button>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="h-[80px]"></div>

          {post.length > 0 &&
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
            ))}
        </div>
      ) : showError ? (
        <h1>ERROR</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default ViewProfile;
