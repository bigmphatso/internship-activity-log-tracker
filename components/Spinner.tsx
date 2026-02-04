
import React from 'react';
import { Loader } from 'lucide-react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
    </div>
  );
};

export default Spinner;
