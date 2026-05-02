export default function DoctorLoading() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-app-surface-2 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="h-4 w-24 bg-app-surface-2 rounded" />
            <div className="h-8 w-12 bg-app-surface-2 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-app-surface-2 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
