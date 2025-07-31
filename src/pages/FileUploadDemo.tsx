import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Database, Satellite, FileText, Image, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const FileUploadDemo = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "📁 Files Queued for Transmission",
        description: `${newFiles.length} file(s) prepared for secure data link.`,
        variant: "default",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    toast({
      title: "🛰️ Transmission Complete",
      description: `${files.length} file(s) successfully uploaded to orbital relay station.`,
      variant: "default",
    });
    setFiles([]);
    setUploadProgress(0);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "🗑️ File Removed",
      description: "File removed from transmission queue.",
      variant: "default",
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-between items-center mb-1 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 009 OPERATIONAL</span>
              <span className="text-accent">⚠ DATA LINK SYSTEMS ACTIVE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">UPLOAD INTERFACE READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="nasa-panel p-2">
            <div className="flex items-center gap-4 mb-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="nasa-panel">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO MISSION CONTROL
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-2 font-futura">
                <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE 009</div>
                <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                  FILE UPLOAD DEMO
                </h1>
                <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">DATA TRANSMISSION PROTOCOLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 max-w-6xl mx-auto">

        {/* Upload Interface */}
        <div className="grid gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Satellite className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold font-futura tracking-wider">SECURE DATA UPLINK</h2>
            </div>
            
            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              id="upload-zone"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2 font-futura tracking-wider">
                DROP CLASSIFIED FILES HERE
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files or click to select from your secure terminal
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="font-futura tracking-wider"
                id="select-files-btn"
              >
                SELECT FILES
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                id="file-input"
              />
            </div>
          </div>
        </div>

        {/* File Queue */}
        {files.length > 0 && (
          <div className="grid gap-6 mb-8">
            <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold font-futura tracking-wider">TRANSMISSION QUEUE</h3>
                <Badge variant="secondary" className="font-futura">
                  {files.length} FILES
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded border">
                    {getFileIcon(file)}
                    <div className="flex-1">
                      <p className="font-medium font-futura">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • Classification: {file.type || 'Unknown'}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeFile(index)}
                      variant="ghost"
                      size="sm"
                      className="font-futura"
                      id={`remove-file-${index}`}
                    >
                      REMOVE
                    </Button>
                  </div>
                ))}
              </div>
              
              {isUploading && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-futura tracking-wider">SECURE TRANSMISSION IN PROGRESS</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadProgress}% complete • Encrypting data stream...
                  </p>
                </div>
              )}
              
              <Button 
                onClick={simulateUpload}
                disabled={isUploading}
                className="w-full font-futura tracking-wider"
                id="upload-files-btn"
              >
                {isUploading ? 'TRANSMITTING...' : 'INITIATE SECURE UPLOAD'}
              </Button>
            </div>
          </div>
        )}

        {/* Upload Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-futura tracking-wider">STANDARD FILE INPUT</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="single-file" className="font-futura tracking-wider">
                  Mission Report (Single File)
                </Label>
                <Input 
                  id="single-file"
                  type="file" 
                  className="mt-2"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
              
              <div>
                <Label htmlFor="multiple-files" className="font-futura tracking-wider">
                  Sensor Data (Multiple Files)
                </Label>
                <Input 
                  id="multiple-files"
                  type="file" 
                  multiple
                  className="mt-2"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-futura tracking-wider">RESTRICTED FILE TYPES</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-only" className="font-futura tracking-wider">
                  Visual Documentation (Images Only)
                </Label>
                <Input 
                  id="image-only"
                  type="file" 
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
              
              <div>
                <Label htmlFor="document-only" className="font-futura tracking-wider">
                  Technical Documents (PDF/Text)
                </Label>
                <Input 
                  id="document-only"
                  type="file" 
                  accept=".pdf,.txt,.doc,.docx"
                  className="mt-2"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Summary */}
        <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 font-futura tracking-wider">MISSION SUMMARY</h3>
          <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>
              File Upload Demo validates secure data transmission protocols for deep space communications. 
              This module tests file selection, drag-and-drop functionality, upload progress monitoring, 
              and various file type restrictions essential for classified mission data handling.
            </p>
            
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2 font-futura tracking-wider">TEST PROTOCOLS:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Single and multiple file selection interfaces</li>
                <li>Drag-and-drop upload zone functionality</li>
                <li>Upload progress visualization and monitoring</li>
                <li>File type validation and restriction handling</li>
                <li>Transmission queue management systems</li>
                <li>Secure file handling and encryption protocols</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadDemo;