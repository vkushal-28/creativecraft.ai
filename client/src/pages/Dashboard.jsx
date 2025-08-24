import React, { useEffect, useState, useCallback } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useUser, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import toast from "react-hot-toast";
import api from "../utils/axios"; // axios instance
import { DashboardLoader } from "../components/common/loaders";

// Reusable stat card
const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-lg">
    <div className="text-slate-600">
      <p className="text-sm">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
    <div
      className={`w-10 h-10 rounded-lg ${gradient} text-white flex justify-center items-center`}>
      <Icon className="w-5 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();

  const getDashboardData = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
        setCreations([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) getDashboardData();
  }, [user, getDashboardData]);

  return (
    <div className="h-full overflow-y-scroll p-6">
      {/* Stats Section */}
      <div className="flex justify-start gap-4 flex-wrap">
        <StatCard
          title="Total Creations"
          value={
            loading ? (
              <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse" />
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
      <div className="space-y-3">
        <p className="mt-6 mb-4 text-xl font-semibold text-slate-700">
          Recent Creations
        </p>
        {loading ? (
          <DashboardLoader />
        ) : creations.length > 0 ? (
          creations.map((item) => <CreationItem key={item.id} item={item} />)
        ) : (
          <p className="text-slate-500">No creations yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
