import { Component, OnInit } from '@angular/core';
import { RequestsService } from "@Services/requests.service";

import { IProduct } from "@Interfaces/product.interface";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public products: IProduct[] | null = [];

  constructor(private Request: RequestsService) {}

  ngOnInit(): void {
    this.getProducts();
  }


  private getProducts(): void {
    this.Request.getProducts()
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.products = this.Request.makeArray(products);
        },
        error: () => {
          console.log('FAILED to get products');
        }
      })
  }

  deleteProduct() {

  }
}
