
export default function Dashboard() {
  const mobile = localStorage.getItem("mobile");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard</h1>
      <p className="text-lg">Welcome, {mobile}</p>
    </div>
  );
}
