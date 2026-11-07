import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <main className="flex items-center justify-centerw">
        <SignIn />
      </main>
    </Suspense>
  );
}
