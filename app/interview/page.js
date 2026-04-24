export const dynamic = "force-dynamic";

import { Suspense } from "react";
import InterviewClient from "./InterviewClient";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Suspense fallback={<div className="text-lg">Loading Interview...</div>}>
        <InterviewClient />
      </Suspense>
    </div>
  );
}
