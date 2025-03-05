import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'agni-signature-pad',
  templateUrl: './signature-pad-container.component.html',
  styleUrls: ['./signature-pad-container.component.css']
})
export class SignaturePadContainerComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() disabled = false;
  @Input() isRequired: boolean = false;
  @Input() label = '';
  @Input() id = '';
  @Input() action = '';
  @Input() previewEnabled = false;
  @Input() hasSubmitted = false;
  value: string | number = '';
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private isDrawing = false;
  unsaveChangesFound = false;
  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl,
    private cdRef: ChangeDetectorRef,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {

  }

  ngOnChanges(): void {
    this.cdRef.detectChanges();
  }


  patchSignature() {
    if (this.action === 'EDIT' && this.value) {
      const RESPONSE_DATA: any = this.value;

      // Check if it's already base64 (new way) or FormData (old way)
      let fileData: string | Blob | null = null;

      if (typeof RESPONSE_DATA === 'string') { // It's base64
        fileData = RESPONSE_DATA;
      } else if (RESPONSE_DATA instanceof FormData) { // It's FormData
        const formDataEntry = RESPONSE_DATA.get('file'); // Get data from formdata
        if (formDataEntry instanceof Blob) {
          fileData = formDataEntry;
        } else if (typeof formDataEntry === 'string') {
          fileData = formDataEntry; // It's a string (base64)
        }
      } else if (RESPONSE_DATA && RESPONSE_DATA.file) { // It's an object with file property
        fileData = RESPONSE_DATA.file;
      }


      if (!fileData) return; // Exit if no file data


      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          this.cdRef.detectChanges(); // Important!
        };
        img.src = reader.result as string;
      };


      if (typeof fileData === 'string') { // It's base64, no need for FileReader if string
        const img = new Image();
        img.onload = () => {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          this.cdRef.detectChanges(); // Important!
        };
        img.src = fileData;
      } else {
        reader.readAsDataURL(fileData); // If it's a blob, read as data URL
      }


      this.cdRef.detectChanges(); // Important!
    }
  }

  // const FILE_DATA: any = RESPONSE_DATA.getAll('file')[0];;
  // if (!FILE_DATA) return;
  // const reader = new FileReader();
  // reader.onload = () => {
  //   const img = new Image();
  //   img.onload = () => {
  //     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear current canvas
  //     this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // Draw image on canvas
  //     this.cdRef.detectChanges();
  //   };
  //   img.src = reader.result as string;
  // };
  // reader.readAsDataURL(FILE_DATA);
  // this.cdRef.detectChanges();
  //   }
  // }

  // trustImageUrl(imageUrl: any){
  //   return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  //  }

  writeValue(value: string | number): void {
    this.value = value;
  }

  registerOnChange(fn: never): void {
    // Store the provided function as an internal method.
    this.onChange = fn;
  }

  registerOnTouched(fn: never): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }

  onTouched() {
    return;
  }

  onChange: (newValue: object | string) => void = () => {
    return;
  };

  ngAfterViewInit(): void {
    if (!this.disabled || this.action === "EDIT") {
      this.canvas = this.signatureCanvas.nativeElement;
      this.context = this.canvas.getContext('2d')!;
      if (!this.previewEnabled)
        this.setupCanvas();
    }
    setTimeout(() => {
      this.patchSignature();
    }, 200);
  }

  private setupCanvas(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';

    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

    // For touch devices
    this.canvas.addEventListener('touchstart', this.startDrawing.bind(this));
    this.canvas.addEventListener('touchmove', this.draw.bind(this));
    this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
  }

  private getMousePosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    const pos = this.getMousePosition(event);
    this.context.beginPath();
    this.context.moveTo(pos.x, pos.y);
  }

  private draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing) return;
    const pos = this.getMousePosition(event);
    this.context.lineTo(pos.x, pos.y);
    this.context.stroke();
    this.unsaveChangesFound = true;
    this.cdRef.detectChanges();
  }

  private stopDrawing(): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.context.closePath();
  }

  clearSignature(): void {
    if (this.action === 'EDIT') {
      this.unsaveChangesFound = true;
    }
    else {
      this.unsaveChangesFound = false;
    }
    this.onChange('');
    this.cdRef.detectChanges();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveSignature(): void {
    this.unsaveChangesFound = false;
    this.canvas.baseURI
    this.canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          this.onChange(base64String);
          this.cdRef.detectChanges();
        };
      }
    }, 'image/png');
  }

  createFormDataFromDataURL(dataUrl: string): FormData {
    const byteString = atob(dataUrl.split(',')[1]); // Decode base64 string
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: mimeString });
    const formData = new FormData();
    formData.append('signature', blob, 'signature.png');
    return formData;
  }


  hasRequiredField(): boolean {
    if (this.isRequired) {
      return true;
    } else if (this.ngControl?.control) {
      return this.ngControl.control?.hasValidator(Validators.required);
    }
    return false;
  }
}
