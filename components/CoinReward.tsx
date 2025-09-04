"use client";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function CoinReward({ visible }: { visible: boolean }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2500); // hide after 2.5s
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-[9999]">
      <DotLottieReact
        src="https://lottie.host/23b0a2e0-1712-4b76-ad62-f3a7753acb50/P7AfYSzg6d.lottie"
        autoplay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
