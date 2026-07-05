"use client";

import { EncoreProvider, useEncore } from "@/context/EncoreContext";
import Navigation from "@/components/Navigation";
import PatronView from "@/components/PatronView";
import ArtistView from "@/components/ArtistView";
import TipJarView from "@/components/TipJarView";
import CityLanding from "@/components/CityLanding";
import { AnimatePresence, motion } from "framer-motion";

function AppContent() {
  const { activeView } = useEncore();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeView === "city" && <CityLanding />}
            {activeView === "patron" && <PatronView />}
            {activeView === "artist" && <ArtistView />}
            {activeView === "tipjar" && <TipJarView />}
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
