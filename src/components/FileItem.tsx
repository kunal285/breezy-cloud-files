
import React from 'react';
import { 
  FileText, File, Image, Film, Music, Archive, 
  Download, Trash2, MoreVertical 
} from 'lucide-react';
import { useFileStorage, FileItem as FileItemType } from '@/context/FileStorageContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface FileItemProps {
  file: FileItemType;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image className="file-icon text-blue-500" />;
  } else if (mimeType.startsWith('video/')) {
    return <Film className="file-icon text-purple-500" />;
  } else if (mimeType.startsWith('audio/')) {
    return <Music className="file-icon text-green-500" />;
  } else if (mimeType.startsWith('text/')) {
    return <FileText className="file-icon text-yellow-500" />;
  } else if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
    return <Archive className="file-icon text-orange-500" />;
  } else {
    return <File className="file-icon text-gray-500" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const { deleteFile, downloadFile } = useFileStorage();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(file.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFile(file.id);
  };

  const isImage = file.type.startsWith('image/');
  
  return (
    <div className="file-card group">
      <div className="p-4">
        {isImage && file.url ? (
          <div className="h-32 w-full flex items-center justify-center overflow-hidden mb-2 rounded-md bg-gray-100">
            <img 
              src={file.url} 
              alt={file.name}
              className="max-h-full max-w-full object-contain" 
            />
          </div>
        ) : (
          <div className="h-32 w-full flex items-center justify-center mb-2">
            {getFileIcon(file.type)}
          </div>
        )}
        
        <div className="mt-2 flex flex-col">
          <h3 className="font-medium truncate text-sm" title={file.name}>
            {file.name}
          </h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(file.lastModified, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      <div className={cn(
        "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
        "flex space-x-1"
      )}>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-7 w-7 bg-white shadow-sm" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 bg-white shadow-sm" 
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FileItem;
