import { Component, OnInit } from '@angular/core';
import { ISweet } from "@Interfaces/sweet.interface";
import { RequestsService } from "@Services/requests.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DeleteService } from "@Services/delete.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component({
  selector: 'app-sweet',
  templateUrl: './sweet.component.html',
  styleUrls: ['./sweet.component.scss']
})
export class SweetComponent implements OnInit {

  public sweet!: ISweet;

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.Request.getSweet(this.route.snapshot.paramMap.get('sweet-id'))
      .subscribe({
        next: (data: ISweet[]) => {
          this.sweet = data[0];
        },
        error: () => {
          console.log('something went wrong.');
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
        this.router.navigateByUrl('sweets')
      });
  }
}
