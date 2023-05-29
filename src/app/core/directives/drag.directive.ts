import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

import { ToastService } from "@Core/services";

@Directive( {
  selector: '[imgDrag]'
} )

export class DragDirective {

  @Output() file: EventEmitter<any> = new EventEmitter();

  @HostBinding( "style.background" ) private background: string = "#c2c2c2 !important";
  @HostBinding( "style.border" ) private border: string = "2px dotted #f3f3f3 !important";
  @HostBinding( "style.transition" ) private transition: string = "0.2s !important";

  constructor(private toastService: ToastService) {}

  @HostListener( "dragover", [ "$event" ] )
  public onDragOver( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = "#b0b0b0 !important";
    this.border = "2px dotted #ffffff !important";
  }

  @HostListener( "dragleave", [ "$event" ] )
  public onDragLeave( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = "#c2c2c2 !important";
    this.border = "2px dotted #f3f3f3 !important";
  }

  @HostListener( "drop", [ "$event" ] )
  public onDrop( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = "#c2c2c2 !important";
    this.border = "2px dotted #f3f3f3 !important";

    const reader = new FileReader();

    if ( event.dataTransfer?.files && event.dataTransfer?.files.length ) {
      const file = event.dataTransfer?.files[0];
      reader.readAsDataURL( file );

      if (
        file.type === "image/jpeg"
        ||
        file.type === "image/png"
        ||
        file.type === "image/jpg"
      ) {
        reader.onload = () => {
          if (file.size > 6000000) {
            this.toastService.showToast('error', 'Error', 'File Size Is Too Large, Please Choose Another One');
            return;
          }
          this.file.emit( reader.result );
        }
      } else {
        return;
      }

    }

  }

}
