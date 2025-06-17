import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, FileText, Music, Loader, CheckCircle, RotateCcw, Share2, AlertCircle } from 'lucide-react';
import { musicProcessor, ProcessingResult } from '../services/musicProcessor';
import { saveAs } from 'file-saver';

interface TranspositionResultsProps {
  fileName: string;
  sourceKey: string;
  targetInstrument: string;
  isProcessing: boolean;
  uploadedFile: File | null;
  onReset: () => void;
  onBack: () => void;
}

const TranspositionResults: React.FC<TranspositionResultsProps> = ({
  fileName,
  sourceKey,
  targetInstrument,
  isProcessing,
  uploadedFile,
  onReset,
  onBack
}) => {
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('Initializing...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isProcessing && uploadedFile) {
      processFile();
    }
  }, [isProcessing, uploadedFile]);

  const processFile = async () => {
    if (!uploadedFile) return;

    try {
      setError('');
      setProcessingStage('Extracting music notation from PDF...');
      
      // Simulate processing stages for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStage('Analyzing key signature and time signature...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStage('Transposing notes for ' + targetInstrument + '...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStage('Generating output files...');
      
      const result = await musicProcessor.processFile(uploadedFile, targetInstrument, sourceKey);
      
      if (result.success) {
        setProcessingResult(result);
        setProcessingStage('Complete!');
      } else {
        setError(result.error || 'Processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleDownload = (format: 'pdf' | 'musicxml' | 'midi') => {
    if (!processingResult) return;

    try {
      switch (format) {
        case 'pdf':
          if (processingResult.pdfBlob) {
            saveAs(processingResult.pdfBlob, `${fileName.replace('.pdf', '')}_${targetInstrument}.pdf`);
          }
          break;
        case 'musicxml':
          if (processingResult.musicXML) {
            const blob = new Blob([processingResult.musicXML], { type: 'application/xml' });
            saveAs(blob, `${fileName.replace('.pdf', '')}_${targetInstrument}.musicxml`);
          }
          break;
        case 'midi':
          if (processingResult.midiBlob) {
            saveAs(processingResult.midiBlob, `${fileName.replace('.pdf', '')}_${targetInstrument}.mid`);
          }
          break;
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const downloadFormats = [
    { 
      name: 'PDF', 
      icon: FileText, 
      description: 'High-quality sheet music',
      format: 'pdf' as const,
      available: !!processingResult?.pdfBlob
    },
    { 
      name: 'MusicXML', 
      icon: Music, 
      description: 'Editable music notation',
      format: 'musicxml' as const,
      available: !!processingResult?.musicXML
    },
    { 
      name: 'MIDI', 
      icon: Music, 
      description: 'Playable audio file',
      format: 'midi' as const,
      available: !!processingResult?.midiBlob
    }
  ];

  if (isProcessing || !processingResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 text-center"
        >
          {error ? (
            <>
              <div className="bg-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Processing Error
              </h2>
              
              <p className="text-red-600 mb-8 max-w-md mx-auto">
                {error}
              </p>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onReset}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                >
                  Upload New File
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Processing Your Music
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our AI is analyzing your sheet music and transposing it for {targetInstrument}. 
                This process typically takes 1-3 minutes depending on the complexity.
              </p>
              
              <div className="bg-gray-100 rounded-xl p-6 max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Extracting notation...</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Analyzing key signature...</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transposing notes...</span>
                    {processingStage.includes('Transposing') ? (
                      <Loader className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Generating output...</span>
                    {processingStage.includes('Generating') ? (
                      <Loader className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : processingStage === 'Complete!' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-blue-600 font-medium">{processingStage}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Selection</span>
          </button>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Transposition Complete!
            </h2>
            <p className="text-gray-600">
              Your sheet music has been successfully transposed
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Transposition Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Original File</p>
              <p className="font-medium text-gray-900 truncate">{fileName}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Source Key</p>
              <p className="font-medium text-gray-900">{sourceKey} (Concert Pitch)</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Target Instrument</p>
              <p className="font-medium text-gray-900">{targetInstrument}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Download Your Transposed Music</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {downloadFormats.map((format, index) => (
              <motion.button
                key={format.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: format.available ? 1.02 : 1 }}
                whileTap={{ scale: format.available ? 0.98 : 1 }}
                onClick={() => format.available && handleDownload(format.format)}
                disabled={!format.available}
                className={`rounded-xl p-6 border-2 transition-all duration-300 text-left group ${
                  format.available
                    ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer'
                    : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    format.available
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                      : 'bg-gray-200'
                  }`}>
                    <format.icon className={`h-6 w-6 ${format.available ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <Download className={`h-5 w-5 transition-colors ${
                    format.available ? 'text-gray-400 group-hover:text-blue-600' : 'text-gray-300'
                  }`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{format.name}</h4>
                <p className="text-sm text-gray-600">{format.description}</p>
                {!format.available && (
                  <p className="text-xs text-red-500 mt-2">Processing failed for this format</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Transpose Another File</span>
          </button>
          
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg">
            <Share2 className="h-5 w-5" />
            <span>Share Results</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TranspositionResults;