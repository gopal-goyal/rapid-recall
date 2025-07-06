export default function SectionCard({ children, title = "Rapid Recall", description = "A fun multiplayer guessing game" }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100 px-4 py-8">

            <header className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight mb-2">{title}</h1>
                <p className="text-base text-gray-600">{description}</p>
            </header>

            <main className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl flex-grow flex flex-col justify-center">
                {children}
            </main>

            <footer className="mt-8 text-sm text-gray-500 text-center">
                Created with ❤️ by Gopal Goyal
            </footer>

        </div>
    );
}
