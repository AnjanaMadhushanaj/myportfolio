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
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Do</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg hover:text-slate-300 transition-colors">
            Transitioning from full-stack development to DevOps & MLOps, I bring a holistic understanding of the software lifecycle.
          </p>
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
