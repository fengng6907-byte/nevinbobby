"use client";

import { EncoreProvider, useEncore } from "@/context/EncoreContext";
import Navigation from "@/components/Navigation";
import PatronView from "@/components/PatronView";
import VenueView from "@/components/VenueView";
import ArtistView from "@/components/ArtistView";
import { AnimatePresence, motion } from "framer-motion";

function AppContent() {
  const { activeView } = useEncore();

  return (
    <div className="min-h-screen bg-[#0D0D11]">
      <Navigation />
      <main className="px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === "patron" && <PatronView />}
            {activeView === "venue" && <VenueView />}
            {activeView === "artist" && <ArtistView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <EncoreProvider>
      <AppContent />
    </EncoreProvider>
  );
}
