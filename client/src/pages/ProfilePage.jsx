











import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, upadteProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ If no image selected, just update text data
    if (!selectedImg) {
      await upadteProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    // ✅ If image selected, convert to base64 and send
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await upadteProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 px-4">
      <div className="w-full max-w-3xl border border-gray-700 rounded-2xl bg-gray-900/50 backdrop-blur-xl flex items-center justify-between max-md:flex-col-reverse transition-all duration-300">
        
        {/* LEFT SIDE: FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-10 flex-1 w-full"
        >
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>

          {/* Upload Section */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-800/60 p-2 rounded-lg transition-all"
          >
            <input
              type="file"
              id="avatar"
              hidden
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="profile"
              className="w-14 h-14 rounded-full object-cover border border-gray-600"
            />
            <span className="text-sm text-gray-300">Upload profile image</span>
          </label>

          {/* Name */}
          <input
            type="text"
            value={name}
            required
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none text-white"
          />

          {/* Bio */}
          <textarea
            value={bio}
            required
            rows={4}
            placeholder="Write your bio..."
            onChange={(e) => setBio(e.target.value)}
            className="p-3 border border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none text-white resize-none"
          ></textarea>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-violet-700 text-white py-3 rounded-full text-lg font-medium hover:opacity-90 transition-all"
          >
            Save Changes
          </button>
        </form>

        {/* RIGHT SIDE: PREVIEW IMAGE */}
        <div className="flex items-center justify-center flex-1 p-10">
          <img
            src={
              selectedImg
                ? URL.createObjectURL(selectedImg)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="Preview"
            className="w-56 h-56 rounded-full border-4 border-violet-500 object-cover shadow-lg max-md:mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
