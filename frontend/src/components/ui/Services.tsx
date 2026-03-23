import { Globe, Palette, Terminal, Database } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Web Development',
      description: 'Building responsive and performant web applications using modern frameworks like React and Next.js.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'UI/UX Design',
      description: 'Crafting premium, glassmorphic interfaces that provide an exceptional user experience.',
      icon: Palette,
      color: 'from-magenta-500 to-purple-500'
    },
    {
      title: 'DevOps & CI/CD',
      description: 'Streamlining deployment pipelines and managing cloud infrastructure for robust applications.',
      icon: Terminal,
      color: 'from-emerald-400 to-cyan-500'
    },
    {
      title: 'MLOps Integration',
      description: 'Deploying machine learning models into production environments with scalability and monitoring.',
      icon: Database,
      color: 'from-orange-400 to-pink-500'
    }
  ];

  return (
    <section id="services" className="py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Services</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-6 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
