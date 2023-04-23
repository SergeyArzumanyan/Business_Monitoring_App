import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { ISweet } from "@Interfaces/sweet.interface";
import { RequestsService } from "@Services/requests.service";
import { DeleteService } from "@Services/delete.service";

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.scss']
})
export class SweetsComponent implements OnInit, OnDestroy {

  public sweets: ISweet[] = [];
  private subscribeToSweetChanges: Subscription | null = null;

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private router: Router
  ) {}

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
          this.sweets = sweets ? this.Request.makeArray(sweets) : [];
        },
        error: () => {
          console.log('FAILED to get sweets.');
        }
      })
  }

  public deleteSweet(name: string): void {
    this.Deletion.deleteItemById('sweets', name);
  }

  public editSweet(name: string): void {
    this.router.navigateByUrl(`sweets/${name}`).then();
  }

}
