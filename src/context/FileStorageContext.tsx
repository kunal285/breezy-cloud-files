
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the file types we'll be dealing with
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  path: string;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parentPath: string;
}

interface FileStorageContextType {
  files: FileItem[];
  folders: Folder[];
  currentPath: string;
  isLoading: boolean;
  uploadProgress: Record<string, number>;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  createFolder: (folderName: string) => Promise<void>;
  navigateToFolder: (path: string) => void;
  navigateUp: () => void;
}

const FileStorageContext = createContext<FileStorageContextType | undefined>(undefined);

// Mock file storage until AWS S3 integration is set up
export const FileStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Mock file upload function
  const uploadFiles = async (newFiles: File[]): Promise<void> => {
    setIsLoading(true);

    try {
      const uploadPromises = newFiles.map(async (file) => {
        const fileId = crypto.randomUUID();
        
        // Simulate upload progress
        const totalUpdates = 10;
        for (let i = 1; i <= totalUpdates; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.floor((i / totalUpdates) * 100)
          }));
        }

        // Create file item
        const fileItem: FileItem = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
          path: `${currentPath}${file.name}`,
          url: URL.createObjectURL(file)
        };

        return fileItem;
      });

      const newFileItems = await Promise.all(uploadPromises);
      
      setFiles(prev => [...prev, ...newFileItems]);
      toast.success(`${newFiles.length} files uploaded successfully`);
      
      // Clear progress after completion
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock delete file function
  const deleteFile = async (fileId: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Find the file to delete for toast message
      const fileToDelete = files.find(file => file.id === fileId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update files state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      
      toast.success(`${fileToDelete?.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock download file function
  const downloadFile = async (fileId: string): Promise<void> => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file || !file.url) {
        throw new Error('File not found');
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${file.name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Mock create folder function
  const createFolder = async (folderName: string): Promise<void> => {
    if (!folderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name: folderName,
        path: `${currentPath}${folderName}/`,
        parentPath: currentPath
      };
      
      setFolders(prev => [...prev, newFolder]);
      toast.success(`Folder "${folderName}" created`);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to a specific folder
  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  // Navigate up one level
  const navigateUp = () => {
    if (currentPath === "/") return;
    
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? "/" : `/${pathParts.join('/')}/`;
    
    setCurrentPath(newPath);
  };

  const value = {
    files,
    folders,
    currentPath,
    isLoading,
    uploadProgress,
    uploadFiles,
    deleteFile,
    downloadFile,
    createFolder,
    navigateToFolder,
    navigateUp
  };

  return (
    <FileStorageContext.Provider value={value}>
      {children}
    </FileStorageContext.Provider>
  );
};

export const useFileStorage = (): FileStorageContextType => {
  const context = useContext(FileStorageContext);
  if (context === undefined) {
    throw new Error('useFileStorage must be used within a FileStorageProvider');
  }
  return context;
};
