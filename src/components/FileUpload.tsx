import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const BrowserImage = globalThis.Image;

interface FileUploadProps {
  onUpload: (filePaths: string[]) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type');
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should be less than ${maxSize}MB`);
      return false;
    }
    return true;
  };

  const convertToJpg = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Not an image file');
    }

    const image = new BrowserImage();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' }));
          } else {
            reject(new Error('Conversion to JPG failed.'));
          }
        }, 'image/jpeg');
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles = selectedFiles.filter(validateFile);

      try {
        const jpgFiles = await Promise.all(validFiles.map(async (file) => {
          const converted = await convertToJpg(file);
          return Object.assign(converted, {
            preview: URL.createObjectURL(converted)
          });
        }));
        setFiles(jpgFiles);
      } catch (error) {
        console.error('Error processing images:', error);
        toast.error('Error processing images');
      }
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

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
      toast.success('Files uploaded successfully');
      setFiles([]);
    } catch (error) {
      toast.error('Error uploading files');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
  };

  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]); // Added files to dependency array

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          className="file-input w-64"
        />
        <Button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
        {files.length > 0 && (
          <Button variant="ghost" onClick={clearFiles}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {files.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <div key={index} className="relative w-20 h-20">
              {file.preview && (
                <Image
                  src={file.preview}
                  alt={file.name}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                  priority={index === 0}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;