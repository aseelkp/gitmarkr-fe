import { useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBookmarks } from '@/hooks/useBookmarks'

export function CSVImportDialog() {
  const [file, setFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [importErrors, setImportErrors] = useState<Array<string>>([])
  const [importStats, setImportStats] = useState<{
    successCount: number
    failedCount: number
  } | null>(null)
  const { importBookmarks, importLoading } = useBookmarks(1, 10)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === 'text/csv' ||
        selectedFile.name.endsWith('.csv')
      ) {
        setFile(selectedFile)
        setImportErrors([])
        setImportStats(null)
      } else {
        toast.error('Please select a CSV file')
      }
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImportErrors([])
    setImportStats(null)
    try {
      const response = await importBookmarks(file)
      const importData = response.data

      if (importData) {
        const { success_count, failed_count, errors } = importData
        setImportStats({
          successCount: success_count,
          failedCount: failed_count,
        })
        setImportErrors(errors)

        if (failed_count === 0 && success_count > 0) {
          setFile(null)
          setIsOpen(false)
          const fileInput = document.getElementById(
            'csv-file-input',
          ) as HTMLInputElement
          fileInput.value = ''
        }
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to import bookmarks')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Bookmarks from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing GitHub repository URLs. The file should
            have a column named <code className="text-xs">repo_url</code> or{' '}
            <code className="text-xs">owner_repo</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>CSV Format:</strong>
              <br />• Column: <code>repo_url</code> (e.g.,
              https://github.com/facebook/react)
              <br />• OR Column: <code>owner_repo</code> (e.g., facebook/react)
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <label
              htmlFor="csv-file-input"
              className="flex flex-1 items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {file ? file.name : 'Select CSV file'}
              </span>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={importLoading}
              />
            </label>
          </div>

          {file && (
            <div className="text-xs text-muted-foreground">
              File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          {importStats && (
            <Alert
              variant={importStats.failedCount > 0 ? 'destructive' : 'default'}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">
                    Import Results: {importStats.successCount} succeeded,{' '}
                    {importStats.failedCount} failed
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {importErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    Validation Errors ({importErrors.length}):
                  </p>
                  <ScrollArea className="h-32 w-full rounded-md border p-2">
                    <ul className="space-y-1 text-xs">
                      {importErrors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-destructive">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setFile(null)
              }}
              disabled={importLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importLoading}
              className="gap-2"
            >
              {importLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
