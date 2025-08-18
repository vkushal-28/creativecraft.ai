import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Download, Heart } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        setCreations([]);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "api/user/toggle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        setCreations([]);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ? (
    <div className="flex-1 h-full flex flex-col p-6">
      <h1 className="text-xl font-semibold text-slate-700 mb-4">Community</h1>

      <div className="h-full w-full rounded-xl overflow-y-scroll">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {creations.map((creation, index) => (
            <div key={index} className="relative group  w-full">
              <img
                src={creation.content}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />

              <div className="absolute bottom-0 top-0 right-0 left-0 flex flex-col justify-between group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg transition-all delay-700">
                {/* Download Button */}
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = creation.content;
                    link.target = "_blank";
                    link.download = "downloaded_image.jpg"; // Specifies the filename for the download
                    document.body.appendChild(link); // Append to body to ensure it's in the DOM
                    link.click(); // Programmatically click the link to trigger download
                    document.body.removeChild(link); // Clean up: remove the link from the DOM
                  }}
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
                        creation.likes.includes(user.id)
                          ? "fill-red-500 text-red-600"
                          : "text-white"
                      }`}
                      onClick={() => imageLikeToggle(creation.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  );
};

export default Community;
