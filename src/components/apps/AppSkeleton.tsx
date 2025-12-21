import React from "react";

export default function AppSkeleton() {
  return (
    <div
      className="
        relative
        rounded-3xl
        bg-base-100/80
        backdrop-blur
        border border-base-200/60
        shadow-md
        p-4
        lg:p-5
        flex flex-col
        overflow-hidden
        animate-pulse
      "
    >
      {/* glow fake */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-200/40 via-transparent to-base-300/30" />

      {/* header */}
      <div className="relative flex items-start gap-3">
        <div
          className="
            skeleton
            w-14 h-14
            lg:w-16 lg:h-16
            rounded-2xl
            shrink-0
          "
        />

        <div className="flex-1 min-w-0 pt-1 space-y-2">
          <div className="skeleton h-4 lg:h-5 w-24 rounded-md" />
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-3/4 rounded-md" />
        </div>
      </div>

      {/* footer */}
      <div
        className="
          relative
          mt-4
          pt-3
          border-t border-base-200/60
          flex justify-between items-center
        "
      >
        <div className="skeleton h-3 lg:h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}
