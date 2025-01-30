import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (filePaths: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(response.data.filePaths);
    } catch (error) {
      console.error('Dosya yüklenirken bir hata oluştu:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Input type="file" multiple onChange={handleFileChange} className="file-input w-64" />
      <Button onClick={handleUpload} disabled={uploading} className="bg-blue-500 text-white hover:bg-blue-600">
        {uploading ? (
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
        ) : (
          'Yükle'
        )}
      </Button>
    </div>
  );
};

export default FileUpload;
