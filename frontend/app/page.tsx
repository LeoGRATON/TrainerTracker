export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <img
              src="/logo/TrainerTracker.png"
              alt="TriZone"
              className="h-12"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-neutral-900 mb-6">
              Entraînement{" "}
              <span className="text-gradient-accent">Intelligent</span>
            </h1>
            <p className="text-xl text-sub mb-8">
              Calculez vos zones d&apos;entraînement et optimisez vos
              performances en course à pied, vélo et natation.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold px-8 py-3 rounded-lg transition-smooth">
                Commencer gratuitement
              </button>
              <button className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-8 py-3 rounded-lg transition-smooth">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Disciplines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-neutral-900 mb-12">
            Trois disciplines, un seul outil
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Course */}
            <div className="p-8 border-2 border-green-200 rounded-2xl hover:border-green-500 transition-smooth bg-green-50/50">
              <div className="w-16 h-16 bg-green-500 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-neutral-900 mb-3">Course à pied</h3>
              <p className="text-sub mb-4">
                Calculez vos zones VMA et créez des séances d&apos;intervalles
                personnalisées.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  VMA
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  5 zones
                </span>
              </div>
            </div>

            {/* Vélo */}
            <div className="p-8 border-2 border-blue-200 rounded-2xl hover:border-blue-500 transition-smooth bg-blue-50/50">
              <div className="w-16 h-16 bg-blue-500 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-neutral-900 mb-3">Vélo</h3>
              <p className="text-sub mb-4">
                Optimisez votre puissance avec vos zones FTP pour progresser
                efficacement.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  FTP
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  5 zones
                </span>
              </div>
            </div>

            {/* Natation */}
            <div className="p-8 border-2 border-cyan-200 rounded-2xl hover:border-cyan-500 transition-smooth bg-cyan-50/50">
              <div className="w-16 h-16 bg-cyan-500 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-neutral-900 mb-3">Natation</h3>
              <p className="text-sub mb-4">
                Suivez votre vitesse critique CSS et structurez vos
                entraînements aquatiques.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  CSS
                </span>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  5 zones
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color System Demo */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-neutral-900 mb-12">Design System</h2>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Neutral Colors */}
            <div>
              <h3 className="text-neutral-900 mb-4">Neutral</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">50</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">100</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-200 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">200</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-300 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">300</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-400 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">400</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-500 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">500</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-600 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">600</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-700 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">700</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-800 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600">800</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-900 rounded-lg mb-2"></div>
                  <p className="text-xs text-neutral-600e">900</p>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-neutral-900 mb-4">Accent (#F3FE39)</h3>
              <div className="flex gap-2 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (weight) => (
                    <div key={weight} className="text-center">
                      <div
                        className={`w-20 h-20 bg-accent-${weight} rounded-lg mb-2`}
                      ></div>
                      <p className="text-xs text-neutral-600">{weight}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Green - Toutes variantes */}
            <div>
              <h3 className="text-neutral-900 mb-4">Green (#34C759)</h3>
              <div className="flex gap-2 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (weight) => (
                    <div key={weight} className="text-center">
                      <div
                        className={`w-20 h-20 bg-green-${weight} rounded-lg mb-2`}
                      ></div>
                      <p className="text-xs text-neutral-600">{weight}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Red - Toutes variantes */}
            <div>
              <h3 className="text-neutral-900 mb-4">Red (#FF383C)</h3>
              <div className="flex gap-2 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (weight) => (
                    <div key={weight} className="text-center">
                      <div
                        className={`w-20 h-20 bg-red-${weight} rounded-lg mb-2`}
                      ></div>
                      <p className="text-xs text-neutral-600">{weight}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Orange - Toutes variantes */}
            <div>
              <h3 className="text-neutral-900 mb-4">Orange (#FF8D28)</h3>
              <div className="flex gap-2 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (weight) => (
                    <div key={weight} className="text-center">
                      <div
                        className={`w-20 h-20 bg-orange-${weight} rounded-lg mb-2`}
                      ></div>
                      <p className="text-xs text-neutral-600">{weight}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Demo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-neutral-900 mb-12">Typographies</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 border border-neutral-200 rounded-xl">
              <p className="text-sm text-sub mb-2">
                Mango Grotesque - Headings
              </p>
              <h1 className="mb-2">Heading 1 - 64px Bold</h1>
              <h2 className="mb-2">Heading 2 - 48px Bold</h2>
              <h3 className="mb-2">Heading 3 - 32px Bold</h3>
              <h4 className="mb-2">Heading 4 - 22px SemiBold</h4>
            </div>
            <div className="p-6 border border-neutral-200 rounded-xl">
              <p className="text-sm text-sub mb-2">Nohemi - Body</p>
              <p className="text-lg font-bold mb-2">Paragraph Bold - Nohemi</p>
              <p className="text-lg font-semibold mb-2">
                Paragraph SemiBold - Nohemi
              </p>
              <p className="text-lg font-medium mb-2">
                Paragraph Medium - Nohemi
              </p>
              <p className="text-lg mb-2">Paragraph Regular - Nohemi</p>
              <p className="text-lg font-light mb-2">
                Paragraph Light - Nohemi
              </p>
              <p className="text-sub">Text secondaire (neutral-500)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo/TrainerTracker.png"
              alt="TriZone"
              className="h-12"
            />
          </div>
          <p className="text-neutral-400">
            Votre application de gestion d&apos;entraînement intelligent
          </p>
        </div>
      </footer>
    </div>
  );
}
