
import React, { useState, useCallback, useEffect } from 'react';
import { InvestmentProject, ProjectFormData } from './types';
import { generateInvestmentProject } from './services/geminiService';
import ProjectForm from './components/ProjectForm';
import ProjectReport from './components/ProjectReport';

const App: React.FC = () => {
  const [project, setProject] = useState<InvestmentProject | null>(null);
  const [history, setHistory] = useState<InvestmentProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'prices' | 'templates' | null>(null);

  // Carregar histórico do localStorage no início
  useEffect(() => {
    const saved = localStorage.getItem('applemar_invest_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    }
  }, []);

  // Salvar no histórico sempre que um novo projeto é gerado
  const saveToHistory = (newProject: InvestmentProject) => {
    const updatedHistory = [newProject, ...history.slice(0, 9)]; // Mantém os últimos 10
    setHistory(updatedHistory);
    localStorage.setItem('applemar_invest_history', JSON.stringify(updatedHistory));
  };

  const handleGenerateProject = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateInvestmentProject(data);
      setProject(generated);
      saveToHistory(generated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError("Houve um erro ao gerar seu projeto. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const resetForm = () => {
    setProject(null);
    setError(null);
  };

  const deleteFromHistory = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('applemar_invest_history', JSON.stringify(updated));
  };

  const loadFromHistory = (proj: InvestmentProject) => {
    setProject(proj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={resetForm}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              Applemar Invest
            </span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <button onClick={() => setActiveModal('templates')} className="text-slate-600 hover:text-indigo-600 transition font-medium text-sm md:text-base">Modelos</button>
            <button onClick={() => setActiveModal('prices')} className="text-slate-600 hover:text-indigo-600 transition font-medium text-sm md:text-base">Preços</button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hidden md:block text-slate-600 hover:text-indigo-600 transition font-medium">Ajuda</a>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!project ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <header className="text-left space-y-4 no-print">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Investimentos em <span className="text-indigo-600">Angola</span> com Inteligência.
                </h2>
                <p className="text-xl text-slate-600">
                  Gere planos de negócios completos e projeções em Kwanzas para o mercado angolano em segundos.
                </p>
              </header>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3">
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <ProjectForm onSubmit={handleGenerateProject} isLoading={isLoading} />
            </div>

            {/* Sidebar Histórico */}
            <aside className="lg:col-span-1 space-y-6 no-print">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Projetos Salvos</span>
                </h3>
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">Seus projetos em Angola aparecerão aqui.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((proj, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => loadFromHistory(proj)}
                        className="group p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition cursor-pointer relative"
                      >
                        <p className="font-semibold text-slate-700 text-sm truncate pr-6">{proj.title}</p>
                        <p className="text-xs text-slate-500">{proj.industry}</p>
                        <button 
                          onClick={(e) => deleteFromHistory(idx, e)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Dica Applemar</h4>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Angola tem um mercado em crescimento. Use a IA para identificar oportunidades em províncias fora de Luanda para maior ROI.
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <ProjectReport project={project} onPrint={handlePrint} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 font-medium text-sm">&copy; 2024 Applemar Invest. Impulsionando o empreendedorismo em Angola.</p>
        </div>
      </footer>

      {/* Modais */}
      {activeModal === 'prices' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl space-y-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Planos e Preços</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Starter', price: 'Grátis', features: ['3 Projetos/mês', 'Exportação PDF', 'IA Standard'] },
                { name: 'Pro', price: '12.000 Kz/mês', features: ['Projetos Ilimitados', 'IA Pro (Gemini 3)', 'Suporte Prioritário', 'Análise Setorial Angola'], popular: true },
                { name: 'Empresa', price: 'Consultar', features: ['Multi-usuário', 'Relatórios Customizados', 'White-label', 'Formação'] }
              ].map((plan, i) => (
                <div key={i} className={`p-6 rounded-2xl border-2 transition ${plan.popular ? 'border-indigo-600 shadow-xl scale-105' : 'border-slate-100'}`}>
                  {plan.popular && <span className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-2 py-1 rounded-full mb-4 inline-block">Recomendado</span>}
                  <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                  <div className="text-2xl font-extrabold text-slate-900 mb-4">{plan.price}</div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="text-sm text-slate-600 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 rounded-xl font-semibold transition ${plan.popular ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>Assinar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'templates' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Setores em Angola</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-slate-500">Selecione uma área estratégica para seu projeto:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Agronegócio (Huambo/Bié)', color: 'bg-emerald-500' },
                { name: 'Pescas e Logística (Namibe)', color: 'bg-blue-500' },
                { name: 'Imobiliário (Talatona/Kilamba)', color: 'bg-amber-500' },
                { name: 'Fintech / Bancos Digitais', color: 'bg-indigo-500' },
                { name: 'Comércio / Retalho (Zango)', color: 'bg-rose-500' },
                { name: 'Energia Solar Províncias', color: 'bg-orange-500' }
              ].map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveModal(null)}
                  className="flex items-center space-x-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition text-left group"
                >
                  <div className={`w-3 h-12 rounded-full ${t.color}`}></div>
                  <div>
                    <span className="font-bold text-slate-800 block">{t.name}</span>
                    <span className="text-xs text-slate-500">Contexto Angolano</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
