import { portfolioData } from '../data/portfoliodata';

export default function GrowthJourney() {
  return (
      <section id="growth" className="py-16 px-6 max-w-4xl mx-auto scroll-mt-28 scroll-mt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#202124]">Growth & Journey</h2>
        <p className="text-gray-600 mt-2">Kurva pembelajaran dan milestone akademis.</p>
      </div>

      <div className="border-l-2 border-blue-200 ml-4 pl-6 space-y-10">
        {portfolioData.growth.map((item, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-[#4285F4] border-4 border-white"></div>
            <span className="text-xs font-bold text-[#4285F4] bg-blue-50 px-2.5 py-1 rounded-md">{item.period}</span>
            <h3 className="text-lg font-bold text-[#202124] mt-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}