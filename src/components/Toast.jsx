import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

export const Toast = () => {
  const { toastMessage } = usePlantora();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          className={`plantora-toast toast-${toastMessage.type}`}
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
        >
          {toastMessage.type === 'success' && <CheckCircle size={18} className="toast-icon-green" />}
          {toastMessage.type === 'warning' && <AlertTriangle size={18} className="toast-icon-amber" />}
          {toastMessage.type === 'info' && <Info size={18} className="toast-icon-blue" />}
          <span className="toast-message-text">{toastMessage.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
