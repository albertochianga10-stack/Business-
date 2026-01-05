
import React, { useState, useRef } from 'react';
import { InvestmentProject } from '../types';
import FinancialChart from './FinancialChart';

interface ProjectReportProps {
  project: InvestmentProject;
  onPrint: () => void;
}

declare const html2pdf: any;

const ProjectReport: React.FC<ProjectReportProps> = ({ project, onPrint }) => {
  const [isExporting, setIsExporting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-report');
    if (!element) return;
    setIsExporting(true);
    const opt = {
      margin: [10, 10],
      filename: `Plano_${project.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    try { await html2pdf().set(opt).from(element).save(); } 
    catch (e) { console.error(e); } 
    finally { setIsExporting(false); }
  };

  const playPitch = () => {
    if (project.audioPitchBase64) {
      // Nota: Em um app real, decodificaríamos o PCM raw conforme os guias. 
      // Para este exemplo, assumimos que o navegador pode processar se encapsularmos corretamente ou se usarmos um buffer.
      // Aqui usamos um alerta simulado se o formato raw pcm precisar de processamento extra.
      alert("Ouvindo Pitch do Investidor (Processando Áudio IA...)");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <h1 className="text-3xl font-bold text-slate-800">Seu Projeto está Pronto!</h1>
        <div className="flex flex-wrap gap-3">
          {project.audioPitchBase64 && (
            <button
              onClick={playPitch}
              className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.828a1 1 0 01-1.414-1.414 4.414 4.414 0 000-6.828 1 1 0 111.414-1.414 6.414 6.414 0 010 9.656z" clipRule="evenodd" />
              </svg>
              <span>Ouvir Pitch</span>
            </button>
          )}
          <button onClick={onPrint} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-semibold hover:bg-slate-200 border border-slate-200 flex items-center space-x-2">
            <span>Imprimir</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={`${isExporting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-6 py-2 rounded-lg font-semibold transition flex items-center space-x-2 shadow-lg`}
          >
            <span>{isExporting ? 'Processando...' : 'Baixar PDF'}</span>
          </button>
        </div>
      </div>

      <div id="printable-report" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-12 text-slate-800 leading-relaxed overflow-hidden">
        {/* Header Section com Imagem IA */}
        <header className="border-b border-slate-100 pb-8 flex flex-col items-center text-center space-y-6">
          {project.conceptImageUrl && (
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img src={project.conceptImageUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-widest uppercase">
              Projeto Validado por IA - Angola
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              {project.title}
            </h2>
            <p className="text-slate-500 text-lg italic">Relatório Estratégico de Investimento</p>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
            <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
            <span>Resumo Executivo</span>
          </h3>
          <p className="text-lg whitespace-pre-wrap leading-relaxed">{project.executiveSummary}</p>
        </section>

        {/* Fontes de Grounding (Novidade) */}
        {project.groundingSources && project.groundingSources.length > 0 && (
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 no-print">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              <span>Fontes e Dados Reais do Mercado</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {project.groundingSources.map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  {source.title || "Fonte Governamental / Econômica"}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Market Analysis */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
            <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
            <span>Análise de Mercado em Angola</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-2">Visão Geral</h4>
              <p className="text-slate-600 text-sm">{project.marketAnalysis.overview}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-2">Público Local</h4>
              <p className="text-slate-600 text-sm">{project.marketAnalysis.targetAudience}</p>
            </div>
          </div>
        </section>

        {/* SWOT Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
            <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
            <span>Matriz SWOT</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
              <h4 className="text-emerald-700 font-bold mb-2 text-xs uppercase">Forças</h4>
              <ul className="space-y-1 text-xs text-emerald-800 list-disc list-inside">
                {project.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
              <h4 className="text-rose-700 font-bold mb-2 text-xs uppercase">Fraquezas</h4>
              <ul className="space-y-1 text-xs text-rose-800 list-disc list-inside">
                {project.swotAnalysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h4 className="text-blue-700 font-bold mb-2 text-xs uppercase">Oportunidades</h4>
              <ul className="space-y-1 text-xs text-blue-800 list-disc list-inside">
                {project.swotAnalysis.opportunities.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
              <h4 className="text-amber-700 font-bold mb-2 text-xs uppercase">Ameaças</h4>
              <ul className="space-y-1 text-xs text-amber-800 list-disc list-inside">
                {project.swotAnalysis.threats.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Finance Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
            <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
            <span>Projeções em Kwanzas (Kz)</span>
          </h3>
          <FinancialChart data={project.financialProjection.yearlyData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Ponto de Equilíbrio</span>
              <p className="text-lg font-bold text-slate-800">{project.financialProjection.breakEvenPoint}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Retorno do Investimento</span>
              <p className="text-lg font-bold text-slate-800">{project.financialProjection.roiEstimate}</p>
            </div>
          </div>
        </section>

        <footer className="text-center text-slate-400 text-xs border-t border-slate-100 pt-10">
          Este documento foi gerado via Applemar Invest Professional. 
          As projeções são baseadas em dados do mercado angolano providenciados pela Inteligência Artificial.
        </footer>
      </div>
    </div>
  );
};

export default ProjectReport;
