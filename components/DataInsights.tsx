import React, { useState, useMemo } from 'react';
import { useMood } from '../contexts/MoodContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, FileText, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const DataInsights: React.FC = () => {
  const { currentTheme, uploadedDataset, apiEnabled } = useMood();
  const c = currentTheme.colors;

  // Process data for charts
  const processedData = useMemo(() => {
    if (!uploadedDataset || uploadedDataset.length === 0) return null;

    // Count moods
    const moodCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const timeOfDayCounts: Record<string, number> = {};

    uploadedDataset.forEach(entry => {
      const mood = entry.mood || 'Unknown';
      const location = entry.location || 'Unknown';
      const time = entry.time || 'Unknown';

      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
      timeOfDayCounts[time] = (timeOfDayCounts[time] || 0) + 1;
    });

    const moodData = Object.keys(moodCounts).map(key => ({ name: key, value: moodCounts[key] }));
    const locationData = Object.keys(locationCounts).map(key => ({ name: key, value: locationCounts[key] }));
    const timeData = Object.keys(timeOfDayCounts).map(key => ({ name: key, value: timeOfDayCounts[key] }));

    return { moodData, locationData, timeData };
  }, [uploadedDataset]);

  const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (!uploadedDataset) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: c.background, color: c.textMain }}>
        <Database size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">No Dataset Uploaded</h2>
        <p className="text-sm opacity-70">Upload a CSV or JSON dataset from the sidebar to view insights.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ backgroundColor: c.background, color: c.textMain }}>
      {/* Header */}
      <div className="pt-12 pb-4 px-6 z-10" style={{ backgroundColor: c.surfaceHighlight }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity size={24} style={{ color: c.primary }} />
          Data Insights
        </h1>
        <p className="text-sm opacity-70 mt-1">
          {apiEnabled ? 'AI-Powered Analysis' : 'Local Analysis'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        
        {/* Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: c.surface, borderColor: c.divider }}
        >
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText size={16} style={{ color: c.accent }} />
            Dataset Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: c.background }}>
              <p className="text-xs opacity-70">Total Entries</p>
              <p className="font-bold text-lg">{uploadedDataset.length}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: c.background }}>
              <p className="text-xs opacity-70">Analysis Mode</p>
              <p className="font-bold text-lg">{apiEnabled ? 'Cloud AI' : 'Local'}</p>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        {processedData && (
          <>
            {/* Mood Distribution */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl border"
              style={{ backgroundColor: c.surface, borderColor: c.divider }}
            >
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={16} style={{ color: c.accent }} />
                Mood Distribution
              </h2>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedData.moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {processedData.moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: c.surface, borderColor: c.divider, borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Location Distribution */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl border"
              style={{ backgroundColor: c.surface, borderColor: c.divider }}
            >
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Database size={16} style={{ color: c.accent }} />
                Location Frequency
              </h2>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.locationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={c.divider} vertical={false} />
                    <XAxis dataKey="name" stroke={c.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke={c.textSecondary} fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: c.surfaceHighlight }}
                      contentStyle={{ backgroundColor: c.surface, borderColor: c.divider, borderRadius: '8px' }} 
                    />
                    <Bar dataKey="value" fill={c.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataInsights;
