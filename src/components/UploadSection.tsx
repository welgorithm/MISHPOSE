import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileMusic, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    // Check file type
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file containing sheet music.');
      return false;
    }
    
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size must be less than 50MB.');
      return false;
    }
    
    setUploadError('');
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile && validateFile(pdfFile)) {
      setUploadedFile(pdfFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
    }
  }, []);

  const handleContinue = () => {
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300"
      >
        {!uploadedFile ? (
          <div
            className={`text-center transition-all duration-300 ${
              isDragOver ? 'scale-105 bg-blue-50/50 rounded-2xl p-4' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upload Your Sheet Music
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Drop your PDF sheet music here or click to browse. We support high-quality PDF files with clear notation.
            </p>
            
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              </motion.div>
            )}
            
            <div className="space-y-4">
              <label className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                <Upload className="h-5 w-5 mr-2" />
                Choose PDF File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              
              <p className="text-sm text-gray-500">
                Supported formats: PDF • Max file size: 50MB
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">File Ready to Process</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <FileMusic className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 truncate max-w-48">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              Continue to Instrument Selection
            </button>
          </motion.div>
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center">
          <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🎵</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Step 1: Upload</h4>
          <p className="text-sm text-gray-600">Upload your PDF sheet music with clear notation</p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🎷</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Step 2: Select</h4>
          <p className="text-sm text-gray-600">Choose your target instrument for transposition</p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">✨</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Step 3: Download</h4>
          <p className="text-sm text-gray-600">Get your professionally transposed sheet music</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;