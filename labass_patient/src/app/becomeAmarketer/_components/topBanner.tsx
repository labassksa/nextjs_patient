// src/components/TopBanner.tsx
import Link from "next/link";
import React from "react";

const TopBanner: React.FC = () => {
  return (
    <div
      className="fixed top-0 w-full bg-custom-green rounded-b-3xl p-4 z-10"
      style={{ minHeight: "10vh" }}
    >
      <div className="mb-4 ">
        <Link href="/" className="text-white underline text-sm">
          labass.sa
        </Link>
      </div>
      {/* Placeholder for any potential top banner content */}
    </div>
  );
};

export default TopBanner;
