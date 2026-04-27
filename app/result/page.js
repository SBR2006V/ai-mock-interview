export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResultClient from "./ResultClient";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <ResultClient />
      </Suspense>

      {/* Back Button */}
    </div>
  );
}
