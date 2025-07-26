import React, { useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown, FileText } from 'lucide-react';

interface DataItem {
  id: number;
  jmeno: string;
  cisloJednotky: string;
  vysledekVyuctovani: number;
  datumZpracovani: string;
  odkazPdf: string;
  bytovyDum: string;
}

interface DataTableProps {
  data: DataItem[];
}

type SortField = keyof DataItem;
type SortDirection = 'asc' | 'desc';

export default function DataTable({ data }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('datumZpracovani');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ');
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue, 'cs')
        : bValue.localeCompare(aValue, 'cs');
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Detailní výsledky</span>
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('jmeno')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Jméno</span>
                  <SortIcon field="jmeno" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('cisloJednotky')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Číslo jednotky</span>
                  <SortIcon field="cisloJednotky" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('bytovyDum')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Budova</span>
                  <SortIcon field="bytovyDum" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('vysledekVyuctovani')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Výsledek vyúčtování</span>
                  <SortIcon field="vysledekVyuctovani" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('datumZpracovani')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Datum zpracování</span>
                  <SortIcon field="datumZpracovani" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PDF
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.jmeno}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.cisloJednotky}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.bytovyDum}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${
                    item.vysledekVyuctovani > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(item.vysledekVyuctovani)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.vysledekVyuctovani > 0 ? 'Přeplatek' : 'Nedoplatek'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.datumZpracovani)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a
                    href={item.odkazPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Stáhnout</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length === 0 && (
        <div className="px-6 py-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Žádná data nebyla nalezena</p>
        </div>
      )}
    </div>
  );
}