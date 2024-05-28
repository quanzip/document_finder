import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnChanges {
  @Input() selectedSite: string | null = null;
  selectedFile: File | null = null;
  uploadedFileName: string | null = null;
  errorMessage: string | null = null;

  constructor(private fileUploadService: FileUploadService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSite']) {
      this.resetFileInput();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.validateFile();
    }
  }

  onUpload(): void {
    if (this.selectedFile && !this.errorMessage) {
      // Implement actual file upload logic to the server here
      this.uploadedFileName = this.selectedFile.name;
      console.log('File uploaded:', this.selectedFile.name);
      this.uploadFile(this.selectedFile)

      // Reset the file input
      this.selectedFile = null;
    }
  }

  uploadFile(file: File): void {
    const documentUrl = 'your_document_url';
    const siteId = 1; // your site ID
    this.fileUploadService.uploadFile(documentUrl, siteId, file)
      .subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          // Handle success response
        },
        error => {
          console.error('Error uploading file:', error);
          // Handle error
        }
      );
  }
  resetFileInput(): void {
    this.selectedFile = null;
    this.uploadedFileName = null;
    this.errorMessage = null;
  }

  validateFile(): void {
    if (!this.selectedFile) return;

    const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'xlsx' || fileExtension === 'csv') {
      this.readFileHeader(this.selectedFile);
    } else {
      this.errorMessage = 'Invalid file format. Only .xlsx and .csv files are allowed.';
      this.selectedFile = null;
    }
  }

  readFileHeader(file: File): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const firstLine = content.split('\n')[0];
      const headers = file.name.endsWith('.csv') ? firstLine.split(',') : firstLine.split(/\t|,/);
      // if (this.hasValidHeaders(headers)) {
      //   this.errorMessage = null;
      // } else {
      //   this.errorMessage = 'Invalid columns. The file must contain "STT", "Keyword", "Question", and "Answer" columns.';
      //   this.selectedFile = null;
      // }
    };
    reader.readAsText(file);
  }

  hasValidHeaders(headers: string[]): boolean {
    const requiredHeaders = ["STT", "Keyword", "Question", "Answer"];
    return headers.length === requiredHeaders.length && requiredHeaders.every((header, index) => header.trim() === headers[index].trim());
  }
}
