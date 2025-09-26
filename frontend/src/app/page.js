"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
      <header className="w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-4 border-b border-gray-700 gap-4 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-orange-400 text-center md:text-left">
          Shoe <span className="text-blue-500">World Base</span>
        </h2>
        <div className="flex gap-3">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm md:text-base"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
          <Button
            className="bg-orange-400 hover:bg-orange-500 text-black px-4 py-2 rounded-lg text-sm md:text-base"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </Button>
        </div>
      </header>
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-600 shadow-xl"
        >
          <Image
            src="/shoe_logo.jpg"
            alt="Shoe World Logo"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>
      </section>
      <section className="w-full max-w-5xl px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center mx-auto">
        {[
          {
            icon: <Zap className="w-10 h-10 text-orange-400 mx-auto mb-4" />,
            title: "Fast Transactions",
            desc: "Lightning-fast checkout process that saves time and boosts efficiency.",
          },
          {
            icon: <BarChart className="w-10 h-10 text-blue-400 mx-auto mb-4" />,
            title: "Real-time Reports",
            desc: "Track sales, stock, and performance with detailed insights.",
          },
          {
            icon: <Shield className="w-10 h-10 text-green-400 mx-auto mb-4" />,
            title: "Secure & Reliable",
            desc: "Your data is encrypted and safe, ensuring peace of mind.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-md hover:scale-105 transition-transform"
          >
            {feature.icon}
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm md:text-base">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
      <section className="text-center max-w-3xl px-6 py-8 md:py-10 mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-400 italic text-sm md:text-base"
        >
          “At Shoe World Base, we believe in innovation, teamwork, and growth.  
          Working here means being part of a family that’s shaping the future of retail.”
        </motion.p>
      </section>
      <footer className="w-full text-center py-4 md:py-6 text-gray-500 text-xs md:text-sm border-t border-gray-700">
        © {new Date().getFullYear()} Shoe World Base. All rights reserved.
      </footer>
    </main>
  );
}
