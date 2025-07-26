import React, { useState, useMemo } from 'react';
import { Calendar, Search, Download, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import DataTable from '../components/DataTable';
import Charts from '../components/Charts';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';

// Mock data - v reálné aplikaci by se načítala z databáze
const mockData = [
  {
    id: 1,
    jmeno: 'Jan Novák',
    cisloJednotky: '1.01',
    vysledekVyuctovani: -1500,
    datumZpracovani: '2024-01-15',
    odkazPdf: 'https://example.com/vyuctovani1.pdf',
    bytovyDum: 'Dům A'
  },
  {
    id: 2,
    jmeno: 'Marie Svobodová',
    cisloJednotky: '1.02',
    vysledekVyuctovani: 2300,
    datumZpracovani: '2024-01-15',
    odkazPdf: 'https://example.com/vyuctovani2.pdf',
    bytovyDum: 'Dům A'
  },
  {
    id: 3,
    jmeno: 'Petr Dvořák',
    cisloJednotky: '2.01',
    vysledekVyuctovani: -800,
    datumZpracovani: '2024-01-16',
    odkazPdf: 'https://example.com/vyuctovani3.pdf',
    bytovyDum: 'Dům B'
  },
  {
    id: 4,
    jmeno: 'Eva Kratochvílová',
    cisloJednotky: '2.02',
    vysledekVyuctovani: 1200,
    datumZpracovani: '2024-01-16',
    odkazPdf: 'https://example.com/vyuctovani4.pdf',
    bytovyDum: 'Dům B'
  },
  {
    id: 5,
    jmeno: 'Tomáš Procházka',
    cisloJednotky: '3.01',
    vysledekVyuctovani: -3200,
    datumZpracovani: '2024-01-17',
    odkazPdf: 'https://example.com/vyuctovani5.pdf',
    bytovyDum: 'Dům C'
  }
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [dateRange, setDateRange] = useState('');

  // Filtrování dat
  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesSearch = item.jmeno.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.cisloJednotky.includes(searchTerm);
      const matchesBuilding = !selectedBuilding || item.bytovyDum === selectedBuilding;
      const matchesDate = !dateRange || item.datumZpracovani.includes(dateRange);
      
      return matchesSearch && matchesBuilding && matchesDate;
    });
  }, [searchTerm, selectedBuilding, dateRange, mockData]);

  // Statistiky
  const stats = useMemo(() => {
    const totalAmount = filteredData.reduce((sum, item) => sum + item.vysledekVyuctovani, 0);
    const prepaid = filteredData.filter(item => item.vysledekVyuctovani > 0);
    const underpaid = filteredData.filter(item => item.vysledekVyuctovani < 0);
    
    return {
      totalRecords: filteredData.length,
      totalAmount,
      prepaidCount: prepaid.length,
      underpaidCount: underpaid.length,
      prepaidAmount: prepaid.reduce((sum, item) => sum + item.vysledekVyuctovani, 0),
      underpaidAmount: Math.abs(underpaid.reduce((sum, item) => sum + item.vysledekVyuctovani, 0))
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Přehled zpracovaných dat
          </h1>
          <p className="text-gray-600 mt-1">
            Celkem {stats.totalRecords} záznamů • Poslední aktualizace: dnes
          </p>
        </div>
        
        <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25">
          <Download className="h-5 w-5" />
          <span>Export dat</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
        dateRange={dateRange}
        setDateRange={setDateRange}
        buildings={[...new Set(mockData.map(item => item.bytovyDum))]}
      />

      {/* Charts */}
      <Charts data={filteredData} />

      {/* Data Table */}
      <DataTable data={filteredData} />
    </div>
  );
}