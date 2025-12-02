export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>

        <h2 className="text-lg font-semibold mb-4">
            {title}
        </h2>
        
        {children}

      </div>
    </div>
  );
}