
import React from "react";
import { CreditCard } from "lucide-react";

// Étapes inchangées
type Step = {
  image: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    image: "/lovable-uploads/5485fcf8-d93c-4cb6-9dda-31e5c7bd75dd.png",
    title: "1. Choose a block",
    description: "Select a free square on the grid to place your sound.",
  },
  {
    image: "/lovable-uploads/7fdf2e25-a29b-41ad-9c23-d02b34dd8f3b.png",
    title: "2. Add your audio",
    description: "Import or record an audio file for the selected block.",
  },
  {
    image: "/lovable-uploads/fbf313fa-b2f7-4e6b-ab64-bf0a86e719e5.png",
    title: "3. Confirm and share",
    description: "Finalize your block reservation, share it or find it on the grid!",
  },
];

const HowItWorks: React.FC = () => (
  <section
    className="w-full max-w-4xl mx-auto my-8 py-8 px-4 bg-[#e5ffe7] rounded-xl flex flex-col items-center shadow-md"
    aria-label="Comment ça marche"
  >
    {/* ----------- La vidéo tuto en haut (YouTube embedded) ----------- */}
    <div className="w-full max-w-2xl mb-10">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          src="https://www.youtube.com/embed/QZSGFE3h3ao?autoplay=1&modestbranding=1&showinfo=0&rel=0&controls=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg border"
        />
      </div>
    </div>

    <h2 className="text-2xl sm:text-3xl font-black text-center mb-7 text-[#05956b]">
      How does it work?
    </h2>

    {/* ----------- Les 3 étapes ----------- */}
    <div className="w-full flex flex-col gap-10 sm:gap-0 sm:flex-row justify-between items-center">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col items-center text-center px-4"
        >
          <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-lg overflow-hidden bg-white border mb-4 flex items-center justify-center shadow">
            <img
              src={step.image}
              alt={step.title}
              className="object-cover w-full h-full"
              style={{ background: "#f7f7f7" }}
              loading="lazy"
            />
          </div>
          <div className="font-bold text-lg mb-2 text-[#05956b]">{step.title}</div>
          <p className="text-gray-700 text-sm">{step.description}</p>
        </div>
      ))}
    </div>

    {/* ----------- Carte bancaire de test ----------- */}
    <div className="mt-12 w-full max-w-2xl text-center border-t-2 border-dashed border-gray-300 pt-8">
      <h3 className="text-xl font-bold text-[#05956b] mb-4">Test payment (Alpha Version)</h3>
      <p className="text-gray-700 mb-6 px-4">
        For the Alpha version of the site, payment is in test phase. Use this card to test how it works.
      </p>
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto font-mono transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="text-lg font-semibold">Test card</div>
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <div className="text-center text-2xl sm:text-3xl tracking-widest mb-6" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          4242 4242 4242 4242
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-gray-400 text-xs uppercase">Expiry date</div>
            <div className="text-lg">12/30</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">CVC</div>
            <div className="text-lg">123</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
