import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { ISweet } from "@Interfaces/sweet.interface";
import { RequestsService } from "@Services/requests.service";
import { DeleteService } from "@Services/delete.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.scss']
})
export class SweetsComponent implements OnInit {

  public sweets: ISweet[] = [];
  private subscribeToSweetChanges: Subscription | null = null;

  public stopLoading: boolean = false;

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private router: Router,
    private db: AngularFireDatabase,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.requestSweets();
  }

  private requestSweets(): void {
    this.subscribeToSweetChanges = this.Request.getSweets()
      .subscribe({
        next: (sweets: ISweet[] | null) => {
          this.sweets = sweets ? this.Request.makeArray(sweets) : [];
          setTimeout(() => {
            if (this.sweets.length === 0) {
              this.stopLoading = true;
            }
          }, 5000);
        },
        error: () => {
          console.log('FAILED to get sweets.');
        }
      })
  }

  public deleteSweet(Name: string): void {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this sweet?',
      header: 'Delete Sweet ?',
      icon: 'pi pi-trash',
      accept: () => {
        this.Deletion.deleteItem('sweets', 'Name', Name)
          .subscribe((actions: any) => {
            actions.forEach((action: any) => {
              const key = action.payload.key;
              this.db.object(`/sweets/${key}`).remove();
            });
          });
      },
      reject: () => {
        console.log('reject');
      }
    });



  }

  public editSweet(ID: number | null): void {
    this.router.navigateByUrl(`sweets/${ID}`);
  }

}
