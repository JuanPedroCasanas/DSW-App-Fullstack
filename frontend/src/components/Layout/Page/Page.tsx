import { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {

  return ( 

  <main 
    className=" grid gap-4 p-3 sm:p-4 md:p-6 pt-20  "
    style={{ paddingTop: "5rem" }}> 
    
    {/* el style ese medio berreta funciona ya que por alguna razon el pt-20 de tailwind no funciona
      5rem = 20px, cosa de que paddingTop:5rem = pt-20 pero bueno!!! quién sabe!!
    */}

      {children}

  </main>
  )
}
