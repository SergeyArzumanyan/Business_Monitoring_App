import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { ISweet } from "@Interfaces/sweet.interface";
import { RequestsService } from "@Services/requests.service";
import { DeleteService } from "@Services/delete.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.scss']
})
export class SweetsComponent implements OnInit {

  public sweets: ISweet[] = [];
  private subscribeToSweetChanges: Subscription | null = null;

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private router: Router,
    private db: AngularFireDatabase
  ) {}

  ngOnInit(): void {
    this.requestSweets();
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

  public deleteSweet(Name: string): void {
    this.Deletion.deleteItemById('sweets', 'Name', Name)
      .subscribe((actions: any) => {
        actions.forEach((action: any) => {
          const key = action.payload.key;
          this.db.object(`/sweets/${key}`).remove();
        });
      });
  }

  public editSweet(Name: string): void {
    this.router.navigateByUrl(`sweets/${Name}`);
  }

}
