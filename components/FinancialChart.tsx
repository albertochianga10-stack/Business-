
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FinancialData } from '../types';

interface FinancialChartProps {
  data: FinancialData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="h-[400px] w-full bg-white p-4 rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Projeção de Receita vs Despesas (Kz)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
              formatter={(value: number) => `${value.toLocaleString()} Kz`}
            />
            <Legend />
            <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[400px] w-full bg-white p-4 rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Evolução do Lucro Líquido (Kz)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
              formatter={(value: number) => `${value.toLocaleString()} Kz`}
            />
            <Legend />
            <Line type="monotone" dataKey="profit" name="Lucro" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;
