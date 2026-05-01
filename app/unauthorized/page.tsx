import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl font-bold text-red-500">403</span>
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You don&apos;t have permission to view this page. Contact your
          administrator if you believe this is a mistake.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        ← Go Back Home
      </Link>
    </div>
  );
}
