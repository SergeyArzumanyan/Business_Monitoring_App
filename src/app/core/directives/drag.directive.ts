import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

import { ToastService } from "@Core/services";

@Directive( {
  selector: '[imgDrag]'
} )

export class DragDirective {

  @Output() file: EventEmitter<any> = new EventEmitter();

  @HostBinding( "style.border" ) private border: string = "4px dotted darkgray";
  @HostBinding( "style.transition" ) private transition: string = "border 0.2s";

  constructor(private toastService: ToastService) {}

  @HostListener( "dragover", [ "$event" ] )
  public onDragOver( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.border = "4px dotted #1f1d1d";
  }

  @HostListener( "dragleave", [ "$event" ] )
  public onDragLeave( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.border = "4px dotted darkgray";
  }

  @HostListener( "drop", [ "$event" ] )
  public onDrop( event: DragEvent ): void {
    event.preventDefault();
    event.stopPropagation();
    this.border = "4px dotted darkgray";

    const reader = new FileReader();

    if ( event.dataTransfer?.files && event.dataTransfer?.files.length ) {
      const file = event.dataTransfer?.files[0];
      reader.readAsDataURL( file );

      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      ) {
        reader.onload = () => {
          if (file.size > 600_00_00) {
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
