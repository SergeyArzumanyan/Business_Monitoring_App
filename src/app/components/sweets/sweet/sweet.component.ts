import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

import { AngularFireDatabase } from "@angular/fire/compat/database";

import {
  ISweet,
  IProduct,
  ISweetProduct,
  ISweetFormEditing
} from "@Core/interfaces";
import {
  RequestsService,
  EditService,
  DeleteService,
  ToastService
} from "@Core/services";

import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-sweet',
  templateUrl: './sweet.component.html',
  styleUrls: ['./sweet.component.scss']
})
export class SweetComponent implements OnInit {

  public isEditMode: boolean = false;
  public sweet!: ISweet;
  public sweetProducts: IProduct[] | null = [];
  private alreadyLoadedProducts: boolean = false;
  public submitted: boolean = false;
  private initialSweetImage: string | null = null; // for keeping first downloaded Image (this is for not making additional network requests.)

  public editSweetForm: FormGroup<ISweetFormEditing> = new FormGroup<ISweetFormEditing>({
    Image: new FormControl<string | null>(null),
    Name: new FormControl<string | null>(null),
    Products: new FormControl<ISweetProduct[] | null>(null)
  })

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private Edition: EditService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getSweet();
  }

  public getSweet(): void {
    const sweetID = Number(this.route.snapshot.paramMap.get('sweet-id'));
    if (isNaN(sweetID)) {
      this.router.navigateByUrl('sweets');
      return;
    }
    this.Request.getSweet(sweetID)
      .subscribe({
        next: (data: ISweet[]) => {
          if (data.length === 0) {
            this.router.navigateByUrl('sweets');
          }
          this.sweet = data[0];
          if (!this.alreadyLoadedProducts) {
            this.getProductsBasedOnSweet(this.sweet.Products);
          } else {
            this.calculateSweetPriceAfterEdit(this.sweetProducts);
          }
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Something Went Wrong');
          this.router.navigateByUrl('sweets');
        }
      })
  }

  public deleteSweet(sweet: ISweet): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this sweet?',
      header: 'Delete Sweet ?',
      icon: 'pi pi-trash icon-big',
      accept: () => {
        this.router.navigateByUrl('sweets')
          .then(() => {
            this.Deletion.deleteItem('sweets', 'ID', sweet.ID)
              .pipe(take(1))
              .subscribe((actions: any) => {
                actions.forEach((action: any) => {
                  const key = action.payload.key;
                  this.db.object(`/sweets/${key}`).remove()
                    .then(() => {
                      this.toastService.showToast('success', 'Done', 'Sweet Deleted Successfully.');
                    })
                    .catch(() => {
                      this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
                    });
                });
              })
          });
      }
    });
  }

  public editSweet(): void {
    this.isEditMode = true;
    this.initialSweetImage = this.sweet.Image; // for keeping first downloaded Image (this is for not making additional network requests.
    this.editSweetForm.patchValue(this.sweet);
  }

  private getProductsBasedOnSweet(productsOfSweet: ISweetProduct[] | null): void {
    if (productsOfSweet) {
      for (const productOfSweet of productsOfSweet) {
        const productQuantity = productOfSweet.Quantity;

        this.Request.getProductsBasedOnSweet(productOfSweet.ProductID)
          .pipe(take(1))
          .subscribe({
            next: (product: IProduct[]) => {
              product[0].Quantity = productQuantity;
              product[0].TotalPrice = productQuantity * product[0].Price;

              this.sweetProducts?.push(product[0]);
              this.calculateSweetPrice(product[0].TotalPrice);

            }
          })
      }
      this.alreadyLoadedProducts = true;
    } else {
      return;
    }
  }

  private calculateSweetPrice(productTotalPrice: number): void {
    !this.sweet.TotalPrice ?
      this.sweet.TotalPrice = productTotalPrice :
      this.sweet.TotalPrice += productTotalPrice!;
  }

  private calculateSweetPriceAfterEdit(sweetProducts: IProduct[] | null): void {
    for (const product of sweetProducts!) {
      !this.sweet.TotalPrice ?
        this.sweet.TotalPrice = product.TotalPrice :
        this.sweet.TotalPrice += product.TotalPrice!;
    }
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
        if (file.size > 6000000) {
          this.toastService.showToast('error', 'Error', 'File Size Is Too Large, Please Choose Another One');
          return;
        }
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
    console.log('sweete to send => ' , this.sweetProducts);
    this.Edition.editItem('sweets', 'ID', this.sweet.ID)
      .pipe(take(1))
      .subscribe((items: any) => {
        this.db.list('/sweets').update(items[0].key, this.editSweetForm.value)
          .then(() => {
            this.toastService.showToast('success', 'Done', 'Sweet Edited Successfully.');
        })
          .catch(() => {
            this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
          });
      });
    this.isEditMode = false;
    this.editSweetForm.markAsPristine();
  }
}
