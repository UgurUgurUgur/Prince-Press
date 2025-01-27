import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsProductService } from './details-product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetailsComponent implements OnInit {
  product: any;
  seriesProducts: any[] = [];
  randomBooks: any[] = []; // Add this line
  currentBookId: any;

  constructor(private DetailsProductService: DetailsProductService, private route: ActivatedRoute, private router: Router) { }

  goToDetailsPage(id: string): void {
    const productId = +id;
    console.log(`Navigating to details page with ID: ${productId}`);
    this.router.navigate([productId, 'details']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id !== null) {
        this.DetailsProductService.getProductById(id).then((product: any) => {
          this.product = product;
          this.currentBookId = this.product.id; // Set currentBookId here
          this.DetailsProductService.getAllProducts().subscribe((allProducts: any[]) => {
            this.seriesProducts = allProducts.filter((product: any) => product.product_title === this.product.product_title);
            this.randomBooks = this.getRandomBooks(allProducts, 12);
          });
        }).catch((err: any) => {
          // Handle error
        });
      }
    });
  }

  getRandomBooks(array: any[], count: number): any[] {
    let shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, count);
  }

  getFilteredSeriesProducts() {
    console.log('currentBookId:', this.currentBookId);
    console.log('seriesProducts:', this.seriesProducts);
    return this.seriesProducts.filter(product => product.id !== this.currentBookId);
  }

  getProductTypeName(productType: string): string {
    switch (productType) {
      case 'LN':
        return 'Light Novel';
      case 'M':
        return 'Manga';
      case 'D':
        return 'Digital';
      default:
        return productType;
    }
  }

  goBack() {
    this.router.navigate(['./home']);
  }

}