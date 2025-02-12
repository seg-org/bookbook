"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <motion.div
          className="h-4 w-4 rounded-full bg-blue-500"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
        />
        <motion.div
          className="h-4 w-4 rounded-full bg-blue-500"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="h-4 w-4 rounded-full bg-blue-500"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.div>
      <p className="text-sm text-gray-500">Loading, please wait...</p>
    </div>
  );
}
