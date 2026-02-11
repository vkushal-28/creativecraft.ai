import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
  useTransition,
} from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { CommunityLoader, ImageCardLoader } from "../components/common/loaders";
import CommunityGalleryModal from "../components/CommunityGalleryModal";
const ImageCard = lazy(() => import("../components/ImageCard"));

const Community = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [creations, setCreations] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPending, startTransition] = useTransition();

  // Fetch community images
  const fetchCreations = useCallback(() => {
    if (!user) return;

    startTransition(async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("api/user/get-published-creations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data?.success) {
          throw new Error(data?.message || "Failed to load creations");
        }

        setCreations(data.creations);
      } catch (err) {
        toast.error(err.message || "Failed to load creations");
      }
    });
  }, [getToken, user]);

  // Like toggle
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
    fetchCreations();
  }, [fetchCreations]);

  // Open gallery
  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <div className="flex-1 h-full flex flex-col p-2 md:p-6">
      <h1 className="text-xl font-semibold text-slate-700 mb-4">Community</h1>

      {!isPending ? (
        <div className="h-full w-full rounded-xl overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {creations.map((creation, index) => (
              <Suspense fallback={<ImageCardLoader />}>
                <div key={creation.id} className="cursor-pointer">
                  <ImageCard
                    creation={creation}
                    userId={user?.id}
                    onLike={imageLikeToggle}
                    openGallery={() => {
                      openGallery(index);
                      setCurrentIndex(index);
                    }}
                  />
                </div>
              </Suspense>
            ))}
          </div>
        </div>
      ) : (
        <CommunityLoader />
      )}

      {/* Gallery Modal */}
      <CommunityGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        creations={creations}
        startIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        userId={user?.id}
        onLike={imageLikeToggle}
      />
    </div>
  );
};

export default Community;
