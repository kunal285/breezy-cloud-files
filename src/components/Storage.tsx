
import React from 'react';
import { FileStorageProvider } from '@/context/FileStorageContext';
import FileUpload from './FileUpload';
import FileExplorer from './FileExplorer';
import CreateFolder from './CreateFolder';

const Storage: React.FC = () => {
  return (
    <FileStorageProvider>
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Breezy Cloud Storage</h1>
          <div className="flex items-center space-x-2">
            <CreateFolder />
            <FileUpload />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <FileExplorer />
        </main>
      </div>
    </FileStorageProvider>
  );
};

export default Storage;
