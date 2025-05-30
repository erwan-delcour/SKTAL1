
export default function ManagerAnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            View parking statistics and usage analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Analytics features will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
