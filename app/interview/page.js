export const dynamic = "force-dynamic";

import { Suspense } from "react";
import InterviewClient from "./InterviewClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <InterviewClient />
    </Suspense>
  );
}