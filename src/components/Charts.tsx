import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataItem {
  id: number;
  jmeno: string;
  cisloJednotky: string;
  vysledekVyuctovani: number;
  datumZpracovani: string;
  odkazPdf: string;
  bytovyDum: string;
}

interface ChartsProps {
  data: DataItem[];
}

export default function Charts({ data }: ChartsProps) {
  // Data pro koláčový graf
  const pieData = [
    {
      name: 'Přeplatky',
      value: data.filter(item => item.vysledekVyuctovani > 0).length,
      color: '#10B981'
    },
    {
      name: 'Nedoplatky',
      value: data.filter(item => item.vysledekVyuctovani < 0).length,
      color: '#EF4444'
    }
  ];

  // Data pro sloupcový graf podle budov
  const buildingData = data.reduce((acc: any[], item) => {
    const existing = acc.find(b => b.building === item.bytovyDum);
    if (existing) {
      existing.amount += item.vysledekVyuctovani;
      existing.count += 1;
    } else {
      acc.push({
        building: item.bytovyDum,
        amount: item.vysledekVyuctovani,
        count: 1
      });
    }
    return acc;
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Poměr přeplatků a nedoplatků
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} jednotek`, 'Počet']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Celková bilance podle budov
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="building" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Bilance']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}