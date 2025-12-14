"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <img src="/logo/TrainerTracker.png" alt="TriZone" />
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
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold px-8 py-3 rounded-lg transition-smooth"
              >
                Commencer gratuitement
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#ffffff",
                    mask: "url(/icons/running.svg) no-repeat center / contain",
                    WebkitMask:
                      "url(/icons/running.svg) no-repeat center / contain",
                  }}
                />
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#ffffff",
                    mask: "url(/icons/cycling.svg) no-repeat center / contain",
                    WebkitMask:
                      "url(/icons/cycling.svg) no-repeat center / contain",
                  }}
                />
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#ffffff",
                    mask: "url(/icons/swimming.svg) no-repeat center / contain",
                    WebkitMask:
                      "url(/icons/swimming.svg) no-repeat center / contain",
                  }}
                />
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

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo/TrainerTracker.png" alt="TriZone" />
          </div>
          <p className="text-neutral-400">
            Votre application de gestion d&apos;entraînement intelligent
          </p>
        </div>
      </footer>
    </div>
  );
}
