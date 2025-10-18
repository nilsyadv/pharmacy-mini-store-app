import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ImportStock() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLines, setParsedLines] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState({
    name: '0',
    category: '1',
    quantity: '2',
    price: '3',
    expiryDate: '4',
    manufacturer: '5',
    sku: '6',
  });
  const [startLine, setStartLine] = useState('0');
  const [endLine, setEndLine] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setParsedLines([]);
      setResult(null);
    }
  };

  const handleParsePDF = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch('/api/import/pdf/parse', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setParsedLines(data.allLines || []);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('fieldMapping', JSON.stringify(fieldMapping));
      formData.append('startLine', startLine);
      if (endLine) formData.append('endLine', endLine);

      const response = await fetch('/api/import/pdf/medicines', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ imported: 0, errors: [error.message] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import Stock from PDF</h1>
          <p className="text-muted-foreground">Upload and import medicine inventory from PDF files</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 1: Upload PDF File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            )}
            <Button onClick={handleParsePDF} disabled={!file}>
              Parse PDF
            </Button>
          </CardContent>
        </Card>

        {parsedLines.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Map PDF Fields to Database Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    The PDF has been parsed into {parsedLines.length} lines. Select which position (column) in each line corresponds to which database field.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(fieldMapping).map(([field, value]) => (
                    <div key={field}>
                      <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, [field]: e.target.value })}
                        min="0"
                        placeholder="Column index"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Start Line (0-indexed)</Label>
                    <Input
                      type="number"
                      value={startLine}
                      onChange={(e) => setStartLine(e.target.value)}
                      min="0"
                      max={parsedLines.length - 1}
                    />
                  </div>
                  <div>
                    <Label>End Line (optional)</Label>
                    <Input
                      type="number"
                      value={endLine}
                      onChange={(e) => setEndLine(e.target.value)}
                      min="0"
                      max={parsedLines.length - 1}
                      placeholder="Leave empty for all"
                    />
                  </div>
                </div>

                <div className="border rounded p-4 max-h-60 overflow-auto">
                  <p className="text-sm font-medium mb-2">Preview (first 10 lines):</p>
                  {parsedLines.slice(0, 10).map((line, i) => (
                    <div key={i} className="text-xs font-mono py-1 border-b">
                      <span className="text-muted-foreground">{i}:</span> {line}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 3: Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleImport} disabled={importing} className="w-full">
                  {importing ? "Importing..." : "Import Medicines"}
                </Button>

                {result && (
                  <Alert variant={result.errors.length > 0 ? "destructive" : "default"}>
                    <div className="flex items-start gap-2">
                      {result.errors.length === 0 ? (
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <AlertDescription>
                          <p className="font-medium">
                            Successfully imported {result.imported} medicine(s)
                          </p>
                          {result.errors.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium">Errors:</p>
                              <ul className="list-disc list-inside text-xs mt-1">
                                {result.errors.slice(0, 10).map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                                {result.errors.length > 10 && (
                                  <li>... and {result.errors.length - 10} more errors</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
