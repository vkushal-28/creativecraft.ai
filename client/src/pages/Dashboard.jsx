import {
  lazy,
  memo,
  useCallback,
  useEffect,
  useState,
  useTransition,
  Suspense,
} from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useUser, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import {
  DashboardCardLoader,
  DashboardLoader,
} from "../components/common/loaders";
import api from "../utils/axios";

const CreationItem = lazy(() => import("../components/CreationItem"));

const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
}) {
  return (
    <div className="flex w-[50%] md:w-72 items-center justify-between rounded-xl border border-gray-200 bg-white p-2 px-3 md:p-4  shadow-lg">
      <div className="text-slate-600">
        <p className="text-sm">{title}</p>
        <h2 className="md:text-xl font-semibold">{value}</h2>
      </div>

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${gradient} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
});

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [creations, setCreations] = useState([]);
  const [isPending, startTransition] = useTransition();

  const [selectedItem, setSelectedItem] = useState(null);

  const activeSubscription = user?.subscriptions?.find(
    (sub) => sub.status === "active"
  );
  console.log(user?.subscriptions);
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = await getToken();
      startTransition(async () => {
        const { data } = await api.get("/api/user/get-user-creations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data?.success) {
          throw new Error(data?.message);
        }

        // Non-blocking state update
        setCreations(data.creations || []);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // --------
  const closeModal = useCallback(() => {
    console.log("first");
    setSelectedItem(null);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [selectedItem, closeModal]);
  // ---------------

  return (
    <div className="h-full overflow-y-auto p-2 md:p-6">
      {/* Stats */}
      <div className="flex max-md:flex-row w-full gap-2 md:gap-4">
        <StatCard
          title="Total Creations"
          value={
            isPending ? (
              <div className="h-6 w-8 animate-pulse rounded bg-gray-200" />
            ) : (
              creations.length
            )
          }
          icon={Sparkles}
          gradient="bg-gradient-to-br from-[#3588F2] to-[#0BB0D7]"
        />

        <StatCard
          title="Active Plan"
          value={
            <Protect plan="premium" fallback="Free">
              Premium
            </Protect>
          }
          icon={Gem}
          gradient="bg-gradient-to-br from-[#f359ba] to-[#853ad6]"
        />
      </div>

      {/* Recent Creations */}
      <section className="mt-3 md:mt-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">
          Recent Creations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-3">
          {isPending ? (
            <DashboardLoader />
          ) : creations.length > 0 ? (
            creations.map((item) => (
              <Suspense fallback={<DashboardCardLoader />} key={item.id}>
                <CreationItem
                  item={item}
                  onSelect={() => setSelectedItem(item)}
                />
              </Suspense>
            ))
          ) : (
            <p className="text-slate-500">No creations yet.</p>
          )}
        </div>
      </section>
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
          onClick={closeModal} // click on overlay closes modal
        >
          <div
            onClick={(e) => e.stopPropagation()} // clicks inside modal don't close it
            className={`bg-white rounded-2xl p-6 overflow-y-auto max-h-[90vh]  w-full ${
              selectedItem.type === "image"
                ? "max-w-xl"
                : "w-full md:max-w-3xl xl:max-w-5xl"
            } relative shadow-xl`}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
              ✕
            </button>

            {/* Type Badge */}
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {selectedItem.type}
            </span>

            {/* Prompt */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Prompt</h3>
              <p className="text-sm text-gray-600">{selectedItem.prompt}</p>
            </div>

            {/* Output */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Output</h3>
              <div className="max-h-150 overflow-auto rounded-xl">
                {selectedItem.type === "image" ? (
                  <img
                    src={selectedItem.content}
                    alt="Generated"
                    className="rounded-xl w-full"
                  />
                ) : (
                  <div className="bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-800">
                    {selectedItem.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
