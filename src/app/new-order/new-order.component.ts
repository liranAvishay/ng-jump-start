import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { IProduct, INewOrder } from 'src/app/shared/interfaces';
import { ValidationService } from '../core/services/validation.service';

@Component({
    selector: 'cm-new-order',
    templateUrl: './new-order.component.html',
    styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
    newOrderForm: FormGroup;
    customerId: number;
    productsList: IProduct[] = [];
    totalCost: number = 0;

    constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService) { }

    ngOnInit() {
        this.buildForm();
        this.route.parent.params.subscribe((params: Params) => this.customerId = +params['id']);

        this.dataService.getProducts().subscribe((products: IProduct[]) => {
            this.productsList = [...products].sort((a: any, b: any) => a.productName < b.productName ? -1 : 1);
        });
        this.onFormChanges();

    }

    buildForm() {
        this.newOrderForm = this.formBuilder.group({
            products: this.formBuilder.array([this.createProductControl()]),
        });
    }

    onFormChanges(): void {
        this.newOrderForm.valueChanges.subscribe(val => {
            const { products } = val
            this.totalCost = this.calculateCost(products)
        });
    }

    calculateCost(products): number {
        return products.reduce((acc, currVal) => {
            if (currVal.productId && currVal.quantity > 0) {
                const orderItem = this.productsList.find(p => p.id === +currVal.productId)
                return acc + orderItem.itemCost * currVal.quantity;
            }
            return acc;
        }, 0).toFixed(2);
    }

    get products(): FormArray {
        return this.newOrderForm.get('products') as FormArray
    }

    createProductControl(): FormGroup {
        return this.formBuilder.group({
            productId: [null, Validators.required],
            quantity: ['1', [Validators.required, ValidationService.onlyNumbersValidator]]
        })
    }

    addProduct(): void {
        this.products.push(this.createProductControl());

    }
    removeProduct(index: number): void {
        this.products.removeAt(index);
    }

    submit({ value, valid }): void {
        if (valid) {
            const newOrderData: INewOrder = {
                customerId: this.customerId,
                newProducts: value.products
            }
            this.dataService.insertNewOrder(newOrderData).subscribe((status) => {
                if (status) {
                    this.router.navigate(['/orders']);
                }
            })
        }
    }
}
