
import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useFileStorage } from '@/context/FileStorageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const FileUpload: React.FC = () => {
  const { uploadFiles, uploadProgress } = useFileStorage();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      setIsDialogOpen(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setIsDialogOpen(true);
    }
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const anyUploadsInProgress = Object.values(uploadProgress).some(progress => progress < 100 && progress > 0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          onChange={handleChange}
          className="hidden" 
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex items-center gap-2 bg-cloud hover:bg-cloud-hover text-white px-4 py-2 rounded-md transition-colors"
        >
          <Upload size={18} />
          Upload Files
        </label>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
            </DialogHeader>
            
            <div 
              className={`dropzone ${dragActive ? 'dropzone-active' : 'dropzone-idle'} mt-4`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-cloud mb-2" />
              <p className="text-sm text-gray-500 mb-1">
                Drag and drop files here or click to browse
              </p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 max-h-[200px] overflow-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-2 bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[180px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {anyUploadsInProgress && (
              <div className="mt-4 space-y-4">
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  progress > 0 && progress < 100 && (
                    <div key={fileId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )
                ))}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
                Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FileUpload;
