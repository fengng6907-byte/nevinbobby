"use client";
import { AnimatePresence, motion } from "framer-motion";
import ArtistView from "@/components/ArtistView";
import CityLanding from "@/components/CityLanding";
import Navigation from "@/components/Navigation";
import PatronView from "@/components/PatronView";
import TipJarView from "@/components/TipJarView";
import { EncoreProvider, useEncore } from "@/context/EncoreContext";

function LegacyApp(){const {activeView}=useEncore();return <div className="min-h-screen"><Navigation/><main className="px-4 sm:px-6 py-6"><AnimatePresence mode="wait"><motion.div key={activeView} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>{activeView==="city"&&<CityLanding/>}{activeView==="patron"&&<PatronView/>}{activeView==="artist"&&<ArtistView/>}{activeView==="tipjar"&&<TipJarView/>}</motion.div></AnimatePresence></main></div>}
export default function LegacyPage(){return <EncoreProvider><LegacyApp/></EncoreProvider>}
