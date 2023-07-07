import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { IContextMenuItem, IContextMenuPosition } from "@Shared/components/table/interfaces";


@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements AfterViewInit {

  @Input() ShowContextMenu!: BehaviorSubject<boolean>;

  @Input() ContextMenuItems: IContextMenuItem[] = [];
  @Input() ContextMenuPosition!: IContextMenuPosition;

  @Input() RowItem: any;

  @ViewChild('contextMenuContainer', { static: false }) contextMenuContainer!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const clickedInside: HTMLElement = this.contextMenuContainer.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.hideContextMenu(new Event('document:click'));
    }
  }

  ngAfterViewInit(): void {
    this.positionContextMenu(this.ContextMenuPosition);
  }

  private positionContextMenu(ContextMenuPosition: IContextMenuPosition): void {
    this.contextMenuContainer.nativeElement.style.top = `${ContextMenuPosition.y}px`;
    this.contextMenuContainer.nativeElement.style.left = `${ContextMenuPosition.x}px`;
  }

  public hideContextMenu(evn: any): void {
    evn.preventDefault();
    evn.stopPropagation();
    this.ShowContextMenu.next(false);
  }
}
