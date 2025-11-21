
// Page.tsx
import { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {
  // Mobile-first: grid + gap, con padding más chico en <=360px.
  return <main className="grid pt-50 gap-4 p-3 sm:p-4 md:p-6 ">
    {children}
  </main>;
}
