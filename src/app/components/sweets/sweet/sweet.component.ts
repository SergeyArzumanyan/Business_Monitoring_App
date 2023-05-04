import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

import { AngularFireDatabase } from "@angular/fire/compat/database";

import { ISweet, ISweetForm } from "@Interfaces/sweet.interface";
import { IProduct } from "@Interfaces/product.interface";
import { RequestsService } from "@Services/requests.service";
import { EditService } from "@Services/edit.service";
import { DeleteService } from "@Services/delete.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-sweet',
  templateUrl: './sweet.component.html',
  styleUrls: ['./sweet.component.scss']
})
export class SweetComponent implements OnInit {

  public isEditMode: boolean = false;
  public sweet!: ISweet;
  public submitted: boolean = false;
  private initialSweetImage: string | null = null; // for keeping first downloaded Image (this is for not making additional network requests.)

  public editSweetForm: FormGroup<ISweetForm> = new FormGroup<ISweetForm>({
    Image: new FormControl<string | null>(null),
    Name: new FormControl<string | null>(null),
    CurrentPrice: new FormControl<number | null>(null),
    Products: new FormControl<IProduct[] | null>(null)
  })

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private Edition: EditService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.getSweet();
  }

  public getSweet(): void {
    this.Request.getSweet(this.route.snapshot.paramMap.get('sweet-id'))
      .subscribe({
        next: (data: ISweet[]) => {
          this.sweet = data[0];
        },
        error: () => {
          console.log('something went wrong.');
          this.router.navigateByUrl('sweets');
        }
      })
  }

  public deleteSweet(Name: string): void {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this sweet?',
      header: 'Delete Sweet ?',
      icon: 'pi pi-trash',
      accept: () => {
        this.router.navigateByUrl('sweets')
          .then(() => {
            this.Deletion.deleteItem('sweets', 'Name', Name)
              .subscribe((actions: any) => {
                actions.forEach((action: any) => {
                  const key = action.payload.key;
                  this.db.object(`/sweets/${key}`).remove();
                });
              })
          });
      },
      reject: () => {
        console.log('reject');
      }
    });



  }

  public editSweet(): void {
    this.isEditMode = true;
    this.initialSweetImage = this.sweet.Image; // for keeping first downloaded Image (this is for not making additional network requests.
    this.editSweetForm.patchValue(this.sweet);
  }

  public cancelEditing(): void {
    this.isEditMode = false;
    this.editSweetForm.reset();
    this.sweet.Image = this.initialSweetImage; // for keeping first downloaded Image (this is for not making additional network requests.
  }

  public onFileChange(event: any) {
    this.editSweetForm.markAsDirty();
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.editSweetForm.controls.Image.setValue(reader.result as string);
      };

    }
  }

  public imageDropped(Image: any): void {
    this.editSweetForm.markAsDirty();
    this.editSweetForm.controls.Image.setValue(Image);
  }

  public imageClear(sweet: ISweet): void {
    sweet.Image = null
    this.editSweetForm.patchValue(sweet);
  }

  public saveEditedSweet(): void {
    console.log(this.sweet.Products);
    this.editSweetForm.controls.Products.setValue(this.sweet.Products);
    this.Edition.editItem('sweets', 'Name', this.sweet.Name)
      .pipe(take(1))
      .subscribe((items: any) => {
        if (this.sweet.Name !== this.editSweetForm.value.Name) {
          this.router.navigateByUrl('sweets');
        }
        this.db.list('/sweets').update(items[0].key, this.editSweetForm.value);
      });
    this.isEditMode = false;
    this.editSweetForm.markAsPristine();
  }
}
