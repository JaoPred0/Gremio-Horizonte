import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppSkeleton from "./AppSkeleton";
import type { App } from "./appsData";
import { PackageOpen } from "lucide-react";

interface AppGridProps {
  apps: App[];
  isLoading: boolean;
}

export default function AppGrid({ apps, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <AppSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center text-base-content/60"
      >
        <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-xl bg-base-200">
          <PackageOpen className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-base font-semibold">
          Nenhum aplicativo encontrado
        </p>
        <p className="text-sm mt-1 max-w-xs">
          Ajuste sua busca ou filtros
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {/* MOBILE */}
      <motion.div
        layout
        className="
    grid
    grid-cols-2
    gap-4
    sm:gap-5
    lg:hidden
  "
      >
        {apps.map((app, index) => (
          <motion.a
            key={app.id}
            href={app.url}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileTap={{ scale: 0.97 }}
            className="
    relative
    rounded-3xl
    bg-base-100/80
    backdrop-blur
    border border-base-200/60
    shadow-md
    p-4
    flex flex-col
    overflow-hidden
  "
          >

            {/* glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-60" />

            {/* header */}
            <div className="relative flex items-start gap-3">
              <div
                className="
            w-14 h-14
            rounded-2xl
            bg-gradient-to-br from-primary/20 to-secondary/20
            flex items-center justify-center
            text-xl
            shadow-inner
            shrink-0
          "
              >
                {app.icon}
              </div>

              <div className="min-w-0 pt-1">
                <p className="text-sm font-semibold truncate">
                  {app.name}
                </p>
                <p className="text-xs text-base-content/60 line-clamp-2 mt-0.5">
                  {app.description}
                </p>
              </div>
            </div>

            {/* footer */}
            <div className="relative mt-4 pt-3 border-t border-base-200/60 flex justify-between items-center">
              <span className="text-[11px] font-medium text-base-content/50">
                {app.category}
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>


      {/* DESKTOP */}
      <motion.div
        layout
        className="
    hidden
    lg:grid
    grid-cols-4
    gap-6
  "
      >
        <AnimatePresence mode="popLayout">
          {apps.map((app, index) => (
            <motion.a
              key={app.id}
              href={app.url}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="
    relative
    rounded-3xl
    bg-base-100/80
    backdrop-blur
    border border-base-200/60
    shadow-md
    hover:shadow-xl
    hover:border-primary/30
    p-4
    lg:p-5
    flex flex-col
    overflow-hidden
    transition-all
  "
            >

              {/* glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-60" />

              {/* header */}
              <div className="relative flex items-start gap-3">
                <div
                  className="
              w-14 h-14
              lg:w-16 lg:h-16
              rounded-2xl
              bg-gradient-to-br from-primary/20 to-secondary/20
              flex items-center justify-center
              text-xl
              lg:text-2xl
              shadow-inner
              shrink-0
            "
                >
                  {app.icon}
                </div>

                <div className="min-w-0 pt-1">
                  <p className="text-sm lg:text-base font-semibold truncate">
                    {app.name}
                  </p>
                  <p className="text-xs lg:text-sm text-base-content/60 line-clamp-2 mt-0.5">
                    {app.description}
                  </p>
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
                <span className="text-[11px] lg:text-xs font-medium text-base-content/50">
                  {app.category}
                </span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
