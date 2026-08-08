function StatCard({ title, value, color, icon }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-white
        p-5
        border
        border-slate-200
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      {/* Decorative background circle */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          opacity-[0.07]
          transition-transform
          duration-500
          group-hover:scale-125
        "
        style={{
          backgroundColor: color,
        }}
      />

      {/* Small bottom accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[3px]
          w-0
          transition-all
          duration-300
          group-hover:w-full
        "
        style={{
          backgroundColor: color,
        }}
      />

      <div className="relative flex items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <p
            className="
            text-xs
            uppercase
            tracking-[0.12em]
            text-slate-500
            font-semibold
            truncate
          "
          >
            {title}
          </p>

          <h2
            className="
              mt-2
              text-4xl
              font-extrabold
              tracking-tight
              leading-none
            "
            style={{
              color,
            }}
          >
            {value}
          </h2>

          <p className="text-xs text-slate-400 mt-2">Current overview</p>
        </div>

        {/* RIGHT ICON */}
        {icon && (
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-2xl
              transition-all
              duration-300
              group-hover:scale-110
            "
            style={{
              backgroundColor: `${color}12`,
              color: color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
