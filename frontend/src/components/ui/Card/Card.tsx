export function Card({ children }: { children: React.ReactNode }) {
  return (
  <div 
    className="bg-white rounded-xl shadow-md border p-4 sm:p-6">
        {children}
  </div>
)
}
