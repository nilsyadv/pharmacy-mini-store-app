import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Database, FileJson } from "lucide-react";

export default function Backup() {
  const handleDownloadBackup = (format: 'sql' | 'json') => {
    const url = `/api/backup/${format}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Backup</h1>
          <p className="text-muted-foreground">Create and download database backups</p>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          Regular backups help protect your data. Download backups and store them safely in a secure location.
          You can manually upload backups to Google Drive or another cloud storage service.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              SQL Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download a complete SQL dump of your database. This backup includes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All table schemas</li>
              <li>All data in SQL format</li>
              <li>Can be restored using PostgreSQL tools</li>
            </ul>
            <Button onClick={() => handleDownloadBackup('sql')} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download SQL Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              JSON Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download a JSON export of your database. This backup includes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All table data in JSON format</li>
              <li>Easy to read and parse</li>
              <li>Useful for data migration and analysis</li>
            </ul>
            <Button onClick={() => handleDownloadBackup('json')} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download JSON Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Frequency:</strong> Create backups daily, weekly, or before major changes.</p>
          <p><strong>Storage:</strong> Store backups in multiple secure locations (e.g., Google Drive, external drive, cloud storage).</p>
          <p><strong>Testing:</strong> Periodically test backup restoration to ensure they work correctly.</p>
          <p><strong>Security:</strong> Keep backups encrypted and protect them with strong passwords.</p>
          <p className="pt-4 border-t">
            <strong>Note:</strong> To enable automatic Google Drive backup, you can set up the Google Drive integration through Replit Integrations or provide Google Drive API credentials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
