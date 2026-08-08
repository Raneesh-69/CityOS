import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AdminCharts from "../../components/AdminCharts";
import { getDashboardStats } from "../../services/adminService";

function AdminAnalytics() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    totalOfficers: 0,
    departments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Add Officer", path: "/admin/add-officer", icon: "👮" },
    { label: "Manage Officers", path: "/admin/officers", icon: "🧑‍💼" },
    { label: "Complaints", path: "/admin/complaints", icon: "📋" },
    { label: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getDashboardStats();

      setStats({
        totalComplaints: data?.totalComplaints || 0,
        pending: data?.pending || 0,
        assigned: data?.assigned || 0,
        inProgress: data?.inProgress || 0,
        resolved: data?.resolved || 0,
        totalOfficers: data?.totalOfficers || 0,
        departments: data?.departments || 0,
      });
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Unable to load analytics data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ==========================================
  // DERIVED ANALYTICS
  // ==========================================

  const analytics = useMemo(() => {
    const total = stats.totalComplaints || 0;

    const resolutionRate =
      total > 0 ? Math.round((stats.resolved / total) * 100) : 0;

    const pendingRate =
      total > 0 ? Math.round((stats.pending / total) * 100) : 0;

    const assignedRate =
      total > 0 ? Math.round((stats.assigned / total) * 100) : 0;

    const progressRate =
      total > 0 ? Math.round((stats.inProgress / total) * 100) : 0;

    const activeComplaints = stats.pending + stats.assigned + stats.inProgress;

    const activeRate =
      total > 0 ? Math.round((activeComplaints / total) * 100) : 0;

    const complaintsPerOfficer =
      stats.totalOfficers > 0
        ? Math.round((total / stats.totalOfficers) * 10) / 10
        : 0;

    let healthScore = resolutionRate;

    if (stats.totalOfficers > 0) {
      healthScore += 10;
    }

    if (stats.departments > 0) {
      healthScore += 10;
    }

    healthScore = Math.min(100, healthScore);

    return {
      resolutionRate,
      pendingRate,
      assignedRate,
      progressRate,
      activeComplaints,
      activeRate,
      complaintsPerOfficer,
      healthScore,
    };
  }, [stats]);

  // ==========================================
  // HEALTH LABEL
  // ==========================================

  const getHealthLabel = () => {
    if (analytics.healthScore >= 80) {
      return "Excellent";
    }

    if (analytics.healthScore >= 60) {
      return "Healthy";
    }

    if (analytics.healthScore >= 40) {
      return "Needs Attention";
    }

    return "Critical";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
        <div className="min-h-[65vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Loading analytics
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Preparing your city operations overview...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="w-1 h-16 rounded-full bg-gradient-to-b from-blue-600 to-cyan-500" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                City Intelligence
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                Analytics Dashboard
              </h1>

              <p className="text-slate-500 mt-2">
                Monitor complaint performance and city operations from one
                place.
              </p>
            </div>
          </div>

          <button
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-white
              border
              border-slate-200
              text-slate-600
              font-semibold
              shadow-sm
              hover:border-blue-300
              hover:text-blue-600
              hover:shadow-md
              transition
              disabled:opacity-50
            "
          >
            <span className={refreshing ? "animate-spin" : ""}>↻</span>

            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div
            className="
            flex
            items-center
            gap-3
            px-5
            py-4
            rounded-2xl
            bg-red-50
            border
            border-red-200
            text-red-700
          "
          >
            <span className="text-xl">!</span>

            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* ==========================================
            EXECUTIVE KPI CARDS
        ========================================== */}

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
        >
          {/* TOTAL */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
            hover:-translate-y-1
            hover:shadow-lg
            transition
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Complaints
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalComplaints}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                📋
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              All reported civic issues
            </p>
          </div>

          {/* PENDING */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
            hover:-translate-y-1
            hover:shadow-lg
            transition
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pending
                </p>

                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.pending}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                ⏳
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              {analytics.pendingRate}% of total complaints
            </p>
          </div>

          {/* IN PROGRESS */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
            hover:-translate-y-1
            hover:shadow-lg
            transition
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  In Progress
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.inProgress}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                🚧
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              {analytics.progressRate}% of total complaints
            </p>
          </div>

          {/* RESOLVED */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
            hover:-translate-y-1
            hover:shadow-lg
            transition
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resolved
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {stats.resolved}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                ✓
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              {analytics.resolutionRate}% resolution rate
            </p>
          </div>
        </div>

        {/* ==========================================
            PERFORMANCE OVERVIEW
        ========================================== */}

        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
        >
          {/* RESOLUTION RATE */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-6
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resolution Rate
                </p>

                <p className="text-4xl font-bold text-emerald-600 mt-2">
                  {analytics.resolutionRate}%
                </p>
              </div>

              <div
                className="
                w-16
                h-16
                rounded-full
                border-[6px]
                border-emerald-100
                flex
                items-center
                justify-center
                text-xs
                font-bold
                text-emerald-600
              "
              >
                {analytics.resolutionRate}%
              </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{
                  width: `${analytics.resolutionRate}%`,
                }}
              />
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Percentage of complaints successfully resolved.
            </p>
          </div>

          {/* ACTIVE WORKLOAD */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-6
          "
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Workload
            </p>

            <div className="flex items-end gap-3 mt-2">
              <p className="text-4xl font-bold text-blue-600">
                {analytics.activeComplaints}
              </p>

              <p className="text-sm text-slate-400 mb-1">complaints</p>
            </div>

            <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${analytics.activeRate}%`,
                }}
              />
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Pending, assigned and in-progress complaints.
            </p>
          </div>

          {/* OFFICER LOAD */}

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-6
          "
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Complaints per Officer
            </p>

            <p className="text-4xl font-bold text-purple-600 mt-2">
              {analytics.complaintsPerOfficer}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <div
                className="
                px-3
                py-1.5
                rounded-lg
                bg-purple-50
                text-purple-700
                text-xs
                font-semibold
              "
              >
                👮 {stats.totalOfficers} Officers
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Average complaint volume per registered officer.
            </p>
          </div>
        </div>

        {/* ==========================================
            EXISTING CHARTS
        ========================================== */}

        <section
          className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          md:p-8
        "
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Visual Intelligence
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Complaint Analytics
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Visual overview of current complaint operations.
            </p>
          </div>

          <AdminCharts stats={stats} />
        </section>

        {/* ==========================================
            STATUS BREAKDOWN
        ========================================== */}

        <section
          className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          md:p-8
        "
        >
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Operations
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Complaint Status Breakdown
              </h2>
            </div>

            <div
              className="
              hidden
              sm:flex
              px-3
              py-1.5
              rounded-full
              bg-slate-100
              text-slate-600
              text-xs
              font-semibold
            "
            >
              Live Overview
            </div>
          </div>

          <div className="space-y-6">
            {/* PENDING */}

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Pending
                </span>

                <span className="text-sm font-bold text-amber-600">
                  {stats.pending}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700"
                  style={{
                    width: `${analytics.pendingRate}%`,
                  }}
                />
              </div>
            </div>

            {/* ASSIGNED */}

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Assigned
                </span>

                <span className="text-sm font-bold text-purple-600">
                  {stats.assigned}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-700"
                  style={{
                    width: `${analytics.assignedRate}%`,
                  }}
                />
              </div>
            </div>

            {/* IN PROGRESS */}

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  In Progress
                </span>

                <span className="text-sm font-bold text-blue-600">
                  {stats.inProgress}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${analytics.progressRate}%`,
                  }}
                />
              </div>
            </div>

            {/* RESOLVED */}

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Resolved
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  {stats.resolved}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{
                    width: `${analytics.resolutionRate}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            CITY OPERATIONS HEALTH
        ========================================== */}

        <section
          className="
          relative
          overflow-hidden
          rounded-3xl
          bg-slate-950
          text-white
          shadow-xl
        "
        >
          <div
            className="
            absolute
            -right-24
            -top-24
            w-72
            h-72
            rounded-full
            bg-blue-500/10
          "
          />

          <div className="relative p-7 md:p-9">
            <div
              className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-8
            "
            >
              <div>
                <p
                  className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-blue-400
                "
                >
                  CityOS Intelligence
                </p>

                <h2
                  className="
                  text-2xl
                  font-bold
                  mt-2
                "
                >
                  City Operations Health
                </h2>

                <p
                  className="
                  text-sm
                  text-slate-400
                  mt-2
                  max-w-xl
                "
                >
                  A high-level indicator derived from complaint resolution,
                  operational coverage and available officer capacity.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div
                  className="
                  w-28
                  h-28
                  rounded-full
                  border-[8px]
                  border-white/10
                  flex
                  items-center
                  justify-center
                  relative
                "
                >
                  <div className="text-center">
                    <p
                      className="
                      text-3xl
                      font-bold
                    "
                    >
                      {analytics.healthScore}
                    </p>

                    <p
                      className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                    >
                      Score
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    className="
                    text-lg
                    font-bold
                  "
                  >
                    {getHealthLabel()}
                  </p>

                  <p
                    className="
                    text-sm
                    text-slate-400
                    mt-1
                  "
                  >
                    Operational condition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            KEY INSIGHTS
        ========================================== */}

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Decision Support
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Key Operational Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* INSIGHT 1 */}

            <div
              className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
            >
              <div
                className="
                w-11
                h-11
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                text-xl
              "
              >
                📊
              </div>

              <h3
                className="
                font-bold
                text-slate-900
                mt-5
              "
              >
                Resolution Performance
              </h3>

              <p
                className="
                text-sm
                text-slate-500
                leading-6
                mt-2
              "
              >
                {analytics.resolutionRate >= 70
                  ? "The current resolution rate indicates strong complaint closure performance."
                  : "A lower resolution rate indicates that additional attention may be required to close outstanding complaints."}
              </p>
            </div>

            {/* INSIGHT 2 */}

            <div
              className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
            >
              <div
                className="
                w-11
                h-11
                rounded-xl
                bg-amber-50
                text-amber-600
                flex
                items-center
                justify-center
                text-xl
              "
              >
                ⚠️
              </div>

              <h3
                className="
                font-bold
                text-slate-900
                mt-5
              "
              >
                Pending Workload
              </h3>

              <p
                className="
                text-sm
                text-slate-500
                leading-6
                mt-2
              "
              >
                {stats.pending > 0
                  ? `${stats.pending} complaint${stats.pending === 1 ? "" : "s"} currently require attention.`
                  : "There are currently no pending complaints requiring initial attention."}
              </p>
            </div>

            {/* INSIGHT 3 */}

            <div
              className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
            "
            >
              <div
                className="
                w-11
                h-11
                rounded-xl
                bg-purple-50
                text-purple-600
                flex
                items-center
                justify-center
                text-xl
              "
              >
                👮
              </div>

              <h3
                className="
                font-bold
                text-slate-900
                mt-5
              "
              >
                Officer Capacity
              </h3>

              <p
                className="
                text-sm
                text-slate-500
                leading-6
                mt-2
              "
              >
                {stats.totalOfficers > 0
                  ? `The system currently has ${stats.totalOfficers} registered officer${stats.totalOfficers === 1 ? "" : "s"} across ${stats.departments} department${stats.departments === 1 ? "" : "s"}.`
                  : "No officers are currently registered in the system."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminAnalytics;
