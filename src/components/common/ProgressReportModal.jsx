import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Printer, X, Download, Dumbbell, Award, Calendar, CheckCircle2 } from 'lucide-react';

export function ProgressReportModal({ clientId, isOpen, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !clientId) return;
    async function loadReport() {
      try {
        setLoading(true);
        const data = await api.getClientReport(clientId);
        setReport(data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [clientId, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Bar (hidden during actual print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center no-print">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-sm">Client Executive Progress Report</span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              PDF Ready
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto print-page space-y-6 text-slate-200">
          {loading || !report ? (
            <div className="p-12 text-center text-xs text-slate-500">Generating report...</div>
          ) : (
            <>
              {/* Header Branding */}
              <div className="flex justify-between items-start border-b border-slate-700 pb-6">
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    thepush<span className="text-emerald-400">fittness</span>
                  </div>
                  <p className="text-xs text-slate-400">Elite Personal Training & Athletic Development</p>
                  <p className="text-xs text-slate-400">Coach: Alex Rivera • alex.trainer@thepushfittness.com</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-emerald-400 block">Progress Report</span>
                  <span className="text-sm font-bold text-white block mt-0.5">{report.client.name}</span>
                  <span className="text-xs text-slate-400">Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Executive Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Starting Weight</span>
                  <span className="text-xl font-bold text-white mt-1 block">{report.summary.startingWeight} kg</span>
                  <span className="text-[10px] text-slate-500">{report.client.startDate}</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Current Weight</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">{report.summary.currentWeight} kg</span>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    {report.summary.weightChange <= 0 ? `${report.summary.weightChange} kg` : `+${report.summary.weightChange} kg`}
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Workout Compliance</span>
                  <span className="text-xl font-bold text-white mt-1 block">{report.summary.workoutAdherence}%</span>
                  <span className="text-[10px] text-slate-500">Overall adherence score: {report.summary.adherenceScore}%</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Sessions Completed</span>
                  <span className="text-xl font-bold text-cyan-400 mt-1 block">{report.summary.sessionsCompleted}</span>
                  <span className="text-[10px] text-slate-500">100% Attendance Rate</span>
                </div>
              </div>

              {/* Measurements Evolution Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Body Circumference Evolution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Weight (kg)</th>
                        <th className="py-2 px-3">Body Fat %</th>
                        <th className="py-2 px-3">Waist (cm)</th>
                        <th className="py-2 px-3">Hips (cm)</th>
                        <th className="py-2 px-3">Chest (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {report.measurements.map(m => (
                        <tr key={m.id}>
                          <td className="py-2 px-3 font-semibold text-white">{m.date}</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{m.weightKg}</td>
                          <td className="py-2 px-3">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '—'}</td>
                          <td className="py-2 px-3">{m.waistCm || '—'}</td>
                          <td className="py-2 px-3">{m.hipsCm || '—'}</td>
                          <td className="py-2 px-3">{m.chestCm || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strength PR Highlights */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Compound Strength & Benchmark Improvements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.performanceMetrics.slice(0, 6).map(p => (
                    <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-400 block">{p.exerciseName}</span>
                      <span className="text-base font-bold text-white block mt-0.5">
                        {p.value} {p.unit} × {p.reps} reps
                      </span>
                      <span className="text-[10px] text-slate-500">Est. 1RM: {p.estimated1RM}kg • {p.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before & After Photos Side-by-Side in Report */}
              {report.progressPhotos.length >= 2 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-white">Visual Transformation Records</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center">
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        Starting Condition ({report.progressPhotos[0].date})
                      </span>
                      <img
                        src={report.progressPhotos[0].imageUrl}
                        alt="Start"
                        className="h-48 w-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center">
                      <span className="text-xs font-bold text-emerald-400 block mb-1">
                        Current Progress ({report.progressPhotos[report.progressPhotos.length - 1].date})
                      </span>
                      <img
                        src={report.progressPhotos[report.progressPhotos.length - 1].imageUrl}
                        alt="Current"
                        className="h-48 w-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Coach Alex Evaluation Summary */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">Coach Alex Summary & Next Phase Roadmap:</span>
                <p className="text-slate-300 leading-relaxed">
                  {report.client.name} has shown remarkable dedication with a {report.summary.workoutAdherence}% workout compliance rate and consistent progressive overload. In the upcoming phase, we will focus on consolidating strength on primary compound lifts while fine-tuning daily macronutrient timing. Keep pushing!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
