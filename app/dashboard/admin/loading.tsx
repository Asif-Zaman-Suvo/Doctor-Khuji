export default function AdminLoading() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-app-surface-2 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
            <div className="h-4 w-20 bg-app-surface-2 rounded" />
            <div className="h-8 w-12 bg-app-surface-2 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-app-surface-2 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
