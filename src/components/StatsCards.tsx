import React from 'react';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalRecords: number;
    totalAmount: number;
    prepaidCount: number;
    underpaidCount: number;
    prepaidAmount: number;
    underpaidAmount: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Celkem jednotek',
      value: stats.totalRecords,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Celková bilance',
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: stats.totalAmount >= 0 ? 'bg-green-500' : 'bg-red-500',
      bgColor: stats.totalAmount >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: stats.totalAmount >= 0 ? 'text-green-700' : 'text-red-700'
    },
    {
      title: 'Přeplatky',
      value: `${stats.prepaidCount} (${formatCurrency(stats.prepaidAmount)})`,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Nedoplatky',
      value: `${stats.underpaidCount} (${formatCurrency(stats.underpaidAmount)})`,
      icon: TrendingDown,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}