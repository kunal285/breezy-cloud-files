
import React from 'react';
import { useFileStorage } from '@/context/FileStorageContext';
import { ChevronRight, Folder, AlertCircle } from 'lucide-react';
import FileItem from './FileItem';
import FolderItem from './FolderItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const FileExplorer: React.FC = () => {
  const { files, folders, currentPath, isLoading, navigateUp } = useFileStorage();

  // Filter files and folders in the current path
  const currentFiles = files.filter((file) => {
    const filePath = file.path.substring(0, file.path.lastIndexOf('/') + 1);
    return filePath === currentPath;
  });
  
  const currentFolders = folders.filter((folder) => folder.parentPath === currentPath);

  // Generate breadcrumb path segments
  const generatePathSegments = () => {
    if (currentPath === '/') return [{ name: 'Home', path: '/' }];
    
    const segments = [{ name: 'Home', path: '/' }];
    const pathParts = currentPath.split('/').filter(Boolean);
    
    let currentPathBuildup = '/';
    
    pathParts.forEach((part) => {
      currentPathBuildup += `${part}/`;
      segments.push({
        name: part,
        path: currentPathBuildup,
      });
    });
    
    return segments;
  };
  
  const pathSegments = generatePathSegments();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="file-card">
              <div className="p-4">
                <Skeleton className="h-32 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const isEmpty = currentFiles.length === 0 && currentFolders.length === 0;
  
  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-1 text-sm font-medium text-gray-500">
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment.path}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            <Button
              variant="link"
              className="px-1 py-0 h-auto"
              onClick={() => navigateUp()}
            >
              {segment.name}
            </Button>
          </React.Fragment>
        ))}
      </nav>
      
      {/* Files and folders grid */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted/20 rounded-full p-4 mb-4">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">This folder is empty</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Upload files or create a new folder to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {currentFolders.map((folder) => (
            <FolderItem key={folder.id} folder={folder} />
          ))}
          
          {currentFiles.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
