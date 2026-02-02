import { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {

  return ( 

  <main 
    className=" grid gap-4 p-3 sm:p-4 md:p-6 pt-20  "> 

      {children}

  </main>
  )
}
