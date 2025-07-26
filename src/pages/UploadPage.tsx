import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileX, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Zde je vaše skutečná URL webhooku z n8n
      const webhookUrl = 'https://n8n.srv882016.hstgr.cloud/webhook/ea5674e0-5091-4c76-9e36-595d14b81d4f';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Spuštění automatizace vyúčtování
        </h1>
        <p className="text-lg text-gray-600">
          Nahrajte Excel soubor pro automatické zpracování dat
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900">
              Nahrajte soubor s daty (.xlsx) *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              
              {file ? (
                <div className="space-y-3">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-green-700">{file.name}</p>
                    <p className="text-xs text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <FileX className="h-4 w-4" />
                    <span>Odstranit soubor</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-base font-medium text-gray-700">
                      Přetáhněte soubor sem nebo klikněte pro výběr
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Podporován pouze formát .xlsx
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              !file || isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:scale-[1.02]'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Zpracovávám...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Spustit zpracování</span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">
                Soubor byl úspěšně odeslán! Přesměrovávám na dashboard...
              </p>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">
                Chyba při nahrávání souboru. Zkuste to prosím znovu.
              </p>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <p className="text-blue-700 font-medium">
                Zpracovávám, vyčkejte prosím...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}