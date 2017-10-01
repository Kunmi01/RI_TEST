import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from './item.model';

@Component({
    selector: 'ri-test-app',
    templateUrl: './app.html',
    styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {

    items: Item[] = [
        {
            code: 'B01',
            name: 'RI Mug',
            price: 4.99,
            quantity: 0,
            total: 0
        },
        {
            code: 'M01',
            name: 'RI the book',
            price: 10.00,
            quantity: 0,
            total: 0
        },
        {
            code: 'V01',
            name: 'Video course on retail analytics',
            price: 29.99,
            quantity: 0,
            total: 0
        }
    ];
    basket: Item[] = [];
    basketTotal = 0;
    discount = 0;
    shippingCost = 0;
    grandTotal = 0;

    constructor() { }

    ngOnInit(): void {
    }

    add(itemCode: string): void {
        const item = this.items.find(_item => {
            return _item.code === itemCode;
        });

        const isInBasket = this.basket.findIndex(_item => {
            return _item.code === itemCode;
        }) >= 0;

        if (!isInBasket) {
            this.basket.push(item);
            item.quantity = 1;
        } else {
            item.quantity += 1;
        }

        this.updateBasket();
    }

    remove(itemCode: string): void {
        const item = this.items.find(_item => {
            return _item.code === itemCode;
        });

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else if (item.quantity === 1) {
            const itemIndexInBasket = this.basket.findIndex(_item => {
                return _item.code === itemCode;
            });
            this.basket.splice(itemIndexInBasket, 1);
            item.quantity = 0;
        }

        this.updateBasket();
    }

    updateBasket(): void {
        this.items.forEach(_item => {
            _item.total = _item.price * _item.quantity;
        });

        this.updateBasketTotal();
        this.updateDiscount();
        this.updateShippingCost();
        this.updateGrandTotal();
    }

    updateBasketTotal(): void {
        this.basketTotal = 0;
        this.items.forEach(item => {
            this.basketTotal += item.total;
        });
    }

    updateDiscount(): void {
        this.discount = 0;

        const m01_item = this.items.find(_item => {
            return _item.code === 'M01';
        });

        const v01_item = this.items.find(_item => {
            return _item.code === 'V01';
        });

        const bothInBasket = this.basket.includes(m01_item) && this.basket.includes(v01_item);

        if (bothInBasket && m01_item.quantity >= v01_item.quantity) {
            this.discount = Math.fround((v01_item.price / 2) * v01_item.quantity);
        } else if (bothInBasket && m01_item.quantity < v01_item.quantity) {
            this.discount = Math.fround((v01_item.price / 2) * m01_item.quantity);
        }
    }

    updateShippingCost(): void {
        this.shippingCost = 0;
        const totalWithDiscount = this.basketTotal - this.discount;
        if (totalWithDiscount > 0 && totalWithDiscount < 10.00) {
            this.shippingCost = 3.99;
        } else if (totalWithDiscount >= 10.00 && totalWithDiscount < 30.00) {
            this.shippingCost = 1.99;
        } else if (totalWithDiscount >= 30.00) {
            this.shippingCost = 0;
        }
    }

    updateGrandTotal(): void {
        this.grandTotal = this.basketTotal - this.discount + this.shippingCost;
    }

    ngOnDestroy(): void {
    }
}
