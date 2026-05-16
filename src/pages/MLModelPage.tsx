import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, RefreshCw } from 'lucide-react';
import { generateFeatureImportance, SUMMARY_STATS } from '../data/mockData';

const FEATURE_IMPORTANCE = generateFeatureImportance();

const MODEL_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  version: `v${i + 1}.0`,
  accuracy: Math.round(60 + i * 2.2 + Math.sin(i) * 3),
  f1Score: +(0.62 + i * 0.018 + Math.sin(i) * 0.02).toFixed(3),
}));

const MLModelPage: React.FC = () => {
  const [threshold, setThreshold] = useState(65);
  const [retraining, setRetraining] = useState(false);

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => setRetraining(false), 3000);
  };

  const trainingPct = (SUMMARY_STATS.mlTrainingCount / 250) * 100;

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Brain size={22} color="var(--cyan)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>ML Model Dashboard</h1>
      </div>

      {/* Status cards */}
      <div className="stats-grid" style={{ gap: \'1rem\', marginBottom: \'1.25rem\' }}>
        {[
          { label: 'Current Accuracy', value: `${SUMMARY_STATS.mlAccuracy}%`, color: 'var(--green)' },
          { label: 'Training Progress', value: `${SUMMARY_STATS.mlTrainingCount}/250`, color: 'var(--cyan)' },
          { label: 'Confidence Threshold', value: `${threshold}%`, color: 'var(--orange)' },
          { label: 'Last Retrain', value: SUMMARY_STATS.mlLastRetrain, color: 'var(--text-secondary)' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="label">{label}</div>
            <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color, fontSize: '1rem', marginTop: '0.25rem', lineHeight: 1.3 }}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Training Progress & Controls */}
      <div className="charts-grid-2" style={{ marginBottom: '1rem' }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-title" style={{ marginBottom: '1.25rem' }}>Training Progress</div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Trades trained on</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan)' }}>{SUMMARY_STATS.mlTrainingCount} / 250</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${trainingPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{(250 - SUMMARY_STATS.mlTrainingCount)} more trades needed for next retrain</div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Model Accuracy</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green)' }}>{SUMMARY_STATS.mlAccuracy}%</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <motion.div
                className="progress-fill progress-fill-green"
                initial={{ width: 0 }}
                animate={{ width: `${SUMMARY_STATS.mlAccuracy}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Confidence Threshold — <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{threshold}%</span>
            </label>
            <input type="range" min="50" max="95" step="1" value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Only signals above {threshold}% confidence will be acted on
            </div>
          </div>

          <motion.button
            className="btn btn-cyan"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleRetrain}
            whileTap={{ scale: 0.97 }}
            disabled={retraining}
          >
            {retraining ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <RefreshCw size={16} />
                </motion.div>
                Retraining...
              </>
            ) : (
              <><RefreshCw size={16} /> Trigger Manual Retrain</>
            )}
          </motion.button>
        </motion.div>

        {/* Feature Importance */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="section-title" style={{ marginBottom: '1rem' }}>Feature Importance</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="feature" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} width={90} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Importance']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem' }} />
              <Bar dataKey="importance" name="Importance" fill="var(--cyan)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Model Performance History */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="section-header">
          <div className="section-title">Model Performance History</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MODEL_HISTORY} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,52,84,0.5)" />
            <XAxis dataKey="version" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
            <YAxis yAxisId="left" domain={[55, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `${v}%`} />
            <YAxis yAxisId="right" orientation="right" domain={[0.6, 0.95]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem' }} />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy %" stroke="var(--cyan)" strokeWidth={2} dot={{ fill: 'var(--cyan)', r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="f1Score" name="F1 Score" stroke="var(--green)" strokeWidth={2} dot={{ fill: 'var(--green)', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default MLModelPage;
