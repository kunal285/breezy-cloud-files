
import React from 'react';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';
import { Folder as FolderType, useFileStorage } from '@/context/FileStorageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FolderItemProps {
  folder: FolderType;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  const { navigateToFolder } = useFileStorage();

  const handleFolderClick = () => {
    navigateToFolder(folder.path);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real implementation, we would check if the folder is empty
    // and then delete it or show a confirmation dialog
    console.log('Delete folder:', folder.name);
  };

  return (
    <div 
      className="file-card group cursor-pointer hover:bg-gray-50"
      onClick={handleFolderClick}
    >
      <div className="p-4">
        <div className="h-32 w-full flex items-center justify-center">
          <Folder className="h-20 w-20 text-cloud" />
        </div>
        
        <div className="mt-2">
          <h3 className="font-medium truncate text-sm" title={folder.name}>
            {folder.name}
          </h3>
        </div>
      </div>

      <div className={cn(
        "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
        "flex space-x-1"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 bg-white shadow-sm"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDeleteClick}
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

export default FolderItem;
