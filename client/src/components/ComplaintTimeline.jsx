import React from "react";

function ComplaintTimeline({ status }) {
  const steps = [
    {
      title: "Complaint Submitted",
      description: "Citizen submitted the complaint.",
      icon: "📝",
      status: "Pending",
    },
    {
      title: "Officer Assigned",
      description: "The complaint was assigned to an officer.",
      icon: "👮",
      status: "Assigned",
    },
    {
      title: "Work In Progress",
      description: "The responsible department is working on the issue.",
      icon: "🚧",
      status: "In Progress",
    },
    {
      title: "Complaint Resolved",
      description: "The reported issue has been resolved.",
      icon: "✅",
      status: "Resolved",
    },
  ];

  const statusIndex = {
    Pending: 0,
    Assigned: 1,
    "In Progress": 2,
    Resolved: 3,
  };

  const currentIndex =
    statusIndex[status] !== undefined ? statusIndex[status] : 0;

  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      {/* Current Status Header */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg">
            📊
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {status || "Pending"}
            </h3>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          Stage {currentIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-7 h-1 rounded-full bg-slate-200"></div>

          {/* Progress Line */}
          <div
            className="absolute left-[12.5%] top-7 h-1 rounded-full bg-emerald-500 transition-all duration-700"
            style={{
              width:
                currentIndex === 0
                  ? "0%"
                  : `${(currentIndex / (steps.length - 1)) * 75}%`,
            }}
          ></div>

          <div className="grid grid-cols-4">
            {steps.map((step, index) => {
              const completed = index <= currentIndex;
              const active = index === currentIndex;

              return (
                <div
                  key={step.status}
                  className="relative flex flex-col items-center px-3 text-center"
                >
                  {/* Circle */}
                  <div
                    className={
                      completed
                        ? "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-500 text-xl text-white shadow-lg"
                        : "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-200 bg-white text-xl text-slate-400"
                    }
                  >
                    {completed ? "✓" : step.icon}
                  </div>

                  {/* Title */}
                  <h4
                    className={
                      completed
                        ? "mt-5 text-sm font-bold text-slate-900"
                        : "mt-5 text-sm font-bold text-slate-400"
                    }
                  >
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p
                    className={
                      completed
                        ? "mt-2 max-w-[190px] text-xs leading-5 text-slate-500"
                        : "mt-2 max-w-[190px] text-xs leading-5 text-slate-400"
                    }
                  >
                    {step.description}
                  </p>

                  {/* Current Badge */}
                  {active && (
                    <span className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Current Stage
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="block md:hidden">
        <div className="relative">
          {/* Vertical Background Line */}
          <div className="absolute bottom-8 left-6 top-8 w-1 rounded-full bg-slate-200"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const completed = index <= currentIndex;
              const active = index === currentIndex;

              return (
                <div
                  key={step.status}
                  className="relative flex items-start gap-5"
                >
                  {/* Circle */}
                  <div
                    className={
                      completed
                        ? "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-500 text-white shadow"
                        : "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-200 bg-white text-slate-400"
                    }
                  >
                    {completed ? "✓" : step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between gap-3">
                      <h4
                        className={
                          completed
                            ? "text-sm font-bold text-slate-900"
                            : "text-sm font-bold text-slate-400"
                        }
                      >
                        {step.title}
                      </h4>

                      {active && (
                        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase text-blue-600">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {Math.round(progress)}% of complaint lifecycle completed
            </p>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 sm:w-64">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintTimeline;
