
import React from 'react';
import { ProjectFormData } from '../types';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    projectName: '',
    industry: '',
    targetMarket: '',
    investmentAmount: '',
    mainGoals: '',
    keyFeatures: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadExample = () => {
    setFormData({
      projectName: 'Kwanza Tech Luanda',
      industry: 'Tecnologia e Pagamentos',
      targetMarket: 'Pequenos comerciantes em Luanda e Benguela',
      investmentAmount: '50.000.000 Kz',
      mainGoals: 'Digitalizar pagamentos em mercados informais e reduzir a dependência de numerário físico.',
      keyFeatures: 'Aplicação móvel que funciona sem internet (USSD) e integração com o Multicaixa Express.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-slate-800">Detalhes do Projeto</h3>
        <button 
          type="button" 
          onClick={loadExample}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full"
        >
          Carregar Exemplo de Angola ✨
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Projeto</label>
          <input
            required
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Ex: Luanda Fresh"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Indústria / Setor</label>
          <input
            required
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Ex: Agricultura / Pescas"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Público-Alvo</label>
          <input
            required
            type="text"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            placeholder="Ex: Jovens em Luanda, Províncias"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Montante do Investimento</label>
          <input
            required
            type="text"
            name="investmentAmount"
            value={formData.investmentAmount}
            onChange={handleChange}
            placeholder="Ex: 10.000.000 Kz"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Principais Metas do Projeto</label>
        <textarea
          required
          name="mainGoals"
          rows={3}
          value={formData.mainGoals}
          onChange={handleChange}
          placeholder="Ex: Ser líder no setor em 3 anos..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Diferenciais Competitivos</label>
        <textarea
          required
          name="keyFeatures"
          rows={3}
          value={formData.keyFeatures}
          onChange={handleChange}
          placeholder="O que torna seu projeto único no mercado angolano?"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-3 shadow-xl ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analisando Mercado Angolano...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Gerar Plano de Investimento</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ProjectForm;
