export default function SectionCard({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100 px-4 py-8">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-blue-600 tracking-tight">Rapid Recall</h1>
        <p className="text-sm text-gray-500">A fun multiplayer guessing game</p>
      </header>

      {/* Main Content */}
      <main className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl flex-grow flex flex-col justify-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-6 text-sm text-gray-500 text-center">
        Created by <span className="font-semibold text-gray-700">Scrapper</span>
      </footer>
    </div>
  );
}
