import React, { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Download, Heart } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios"; // custom axios instance
import { CommunityLoader } from "../components/common/loaders";

// Card component (memoized for performance)
const ImageCard = React.memo(({ creation, userId, onLike }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = creation.content;
    link.target = "_blank";
    link.download = "downloaded_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group w-full">
      <img
        src={creation.content}
        alt={creation.prompt || "Community Creation"}
        loading="lazy"
        className="w-full h-full object-cover rounded-lg"
      />

      <div className="absolute inset-0 flex flex-col justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg transition-all duration-500">
        {/* Download */}
        <button
          onClick={handleDownload}
          className="self-end cursor-pointer flex items-center gap-1 px-2 py-2 rounded-md bg-black/50 hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0">
          <Download className="w-4 h-4" />
        </button>

        <div className="flex items-end justify-end">
          <p className="text-sm hidden group-hover:block mr-3">
            {creation.prompt}
          </p>
          <div className="flex gap-1 items-end">
            <p>{creation.likes.length}</p>
            <Heart
              className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                creation.likes.includes(userId)
                  ? "fill-red-500 text-red-600"
                  : "text-white"
              }`}
              onClick={() => onLike(creation.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const imageLikeToggle = useCallback(
    async (id) => {
      try {
        const token = await getToken();
        const { data } = await api.post(
          "api/user/toggle-like-creation",
          { id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success(data.message);
          // Optimistic update
          setCreations((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    likes: c.likes.includes(user.id)
                      ? c.likes.filter((uid) => uid !== user.id)
                      : [...c.likes, user.id],
                  }
                : c
            )
          );
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    },
    [getToken, user?.id]
  );

  useEffect(() => {
    if (user) fetchCreations();
  }, [user, fetchCreations]);

  return (
    <div className="flex-1 h-full flex flex-col p-6">
      <h1 className="text-xl font-semibold text-slate-700 mb-4">Community</h1>

      {!loading ? (
        <div className="h-full w-full rounded-xl overflow-y-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creations.map((creation) => (
              <ImageCard
                key={creation.id}
                creation={creation}
                userId={user?.id}
                onLike={imageLikeToggle}
              />
            ))}
          </div>
        </div>
      ) : (
        <CommunityLoader />
      )}
    </div>
  );
};

export default Community;
