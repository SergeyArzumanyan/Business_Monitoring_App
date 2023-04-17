import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISweet } from "@Interfaces/sweet.interface";
import { Subscription } from "rxjs";
import { RequestsService } from "@Services/requests.service";

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.scss']
})
export class SweetsComponent implements OnInit, OnDestroy {
  public sweets: ISweet[] = [];
  private subscribeToSweetChanges: Subscription | null = null;
  constructor(private Request: RequestsService) {}

  ngOnInit(): void {
    this.requestSweets();
  }

  ngOnDestroy(): void {
    this.subscribeToSweetChanges?.unsubscribe();
  }

  private requestSweets(): void {
    this.subscribeToSweetChanges = this.Request.getSweets()
      .subscribe({
        next: (sweets: ISweet[] | null) => {
          this.sweets = this.Request.makeArray(sweets);
          console.log(this.sweets);
        },
        error: () => {
          console.log('FAILED to get sweets.');
        }
      })
  }

}
