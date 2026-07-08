import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon, color, delay = 0 }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="card stat-card"
        >
            <div className="stat-header">
                <div className="stat-icon-wrapper" style={{ background: `${color}20`, color: color }}>
                    {icon}
                </div>
                {/* Optional trend indicator could go here */}
            </div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </motion.div>
    )
}
