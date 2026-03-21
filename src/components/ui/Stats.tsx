export default function Stats() {
  const stats = [
    { label: 'Experience', value: 'Years 1 +' },
    { label: 'Projects', value: '100 +' },
    { label: 'Clients', value: '10 +' },
    { label: 'Views', value: '10K +' },
  ];

  return (
    <section className="py-12 relative w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:bg-white/[0.06] transition-colors duration-300 flex flex-col justify-start"
            >
              <p className="text-slate-300 font-medium mb-3">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-wide">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
