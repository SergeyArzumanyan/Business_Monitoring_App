import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, take, takeUntil } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

import {
  ISweet,
  IProduct,
  ISweetProduct,
  ISweetFormEditing,
  IFirebaseItemDeletion,
} from "@Core/interfaces";
import {
  RequestsService,
  EditService,
  DeleteService,
  ToastService,
  CalculationService,
} from "@Core/services";

import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-sweet',
  templateUrl: './sweet.component.html',
  styleUrls: ['./sweet.component.scss']
})
export class SweetComponent implements OnInit, OnDestroy {

  public isEditMode: boolean = false;
  public sweet!: ISweet;
  public sweetProducts: IProduct[] | null = [];
  private alreadyLoadedProducts: boolean = false;
  public submitted: boolean = false;
  private initialSweetImage: string | null = null; // for keeping first downloaded Image (this is for not making additional network requests.)

  public pending: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  public editSweetForm: FormGroup<ISweetFormEditing> = new FormGroup<ISweetFormEditing>({
    Image: new FormControl<string | null>(null),
    Name: new FormControl<string | null>(null),
    Products: new FormControl<ISweetProduct[] | null>(null)
  })

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private Edition: EditService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private calculationService: CalculationService,
  ) {}

  ngOnInit(): void {
    this.getSweet();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getSweet(): void {
    this.pending = true;
    const sweetID = Number(this.route.snapshot.paramMap.get('sweet-id'));

    if (isNaN(sweetID)) {
      this.router.navigateByUrl('sweets');
      return;
    }
    this.Request.getSweet(sweetID)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: ISweet[]) => {
          if (data.length === 0) {
            this.router.navigateByUrl('sweets');
          }
          this.pending = false;
          this.sweet = data[0];
          if (!this.alreadyLoadedProducts) {
            this.getProductsBasedOnSweet(this.sweet.Products!);
          } else if (this.sweet) {
            this.calculationService.calculateSweetPriceAfterEdit(this.sweet, this.sweetProducts);
          }
        },
        error: () => {
          this.pending = false;
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
              .subscribe((action: IFirebaseItemDeletion[]) => {
                this.Deletion.removeItem('sweets', action[0].payload.key, 'Sweet', true);
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

  public cancelEditing(): void {
    this.isEditMode = false;
    this.editSweetForm.reset();
    this.sweet.Image = this.initialSweetImage; // for keeping first downloaded Image (this is for not making additional network requests.
  }

  public saveEditedSweet(): void {

    this.editSweetForm.value.Products = this.EditProductsForSweet();

    this.Edition.editItem('sweets', 'ID', this.sweet.ID)
      .pipe(take(1))
      .subscribe((items: any) => {
          this.Edition.updateCurrentItem('sweets', this.editSweetForm.value, items[0].key)
          .then(() => {
            this.toastService.showToast('success', 'Done', 'Sweet Edited Successfully.');
            this.getProductsBasedOnSweet(this.editSweetForm.value.Products!);

            this.calculationService.calculateSweetPriceAfterEdit(this.sweet, this.sweetProducts);
          })
          .catch(() => {
            this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
          });
      });
    this.isEditMode = false;
    this.editSweetForm.markAsPristine();
  }

  private getProductsBasedOnSweet(productsOfSweet: ISweetProduct[]): void {
    this.sweetProducts = [];

    if (productsOfSweet) {
      this.calculationService.calcTotalSweetPrice(this.sweet, productsOfSweet, this.sweetProducts);
      this.alreadyLoadedProducts = true;
    } else {
      return;
    }
  }

  public imageDropped(Image: any): void {
    this.editSweetForm.markAsDirty();
    this.editSweetForm.controls.Image.setValue(Image);
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

  public imageClear(sweet: ISweet): void {
    sweet.Image = null
    this.editSweetForm.patchValue(sweet);
  }

  private EditProductsForSweet(): ISweetProduct[] {
    const EditedProductsForSending: ISweetProduct[] = [];

    if (this.sweetProducts) {
      for (const product of this.sweetProducts) {
        const mutatedProduct: ISweetProduct = {
          ProductID: product.ID,
          Quantity: product.Quantity
        }
        EditedProductsForSending.push(mutatedProduct);
      }
    }

    return EditedProductsForSending;
  }

}
