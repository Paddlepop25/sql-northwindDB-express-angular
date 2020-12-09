import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderModel } from '../models/order.model';
import { OrderIdService } from '../services/service';

@Component({
  selector: 'app-order-id-form',
  templateUrl: './order-id-form.component.html',
  styleUrls: ['./order-id-form.component.css']
})
export class OrderIdFormComponent implements OnInit {

  orderIdForm: FormGroup
  orderFormDetails: OrderModel[]

  constructor(private fb: FormBuilder, private orderIdSvc: OrderIdService) { }
  
  ngOnInit(): void {
    this.orderIdForm = this.fb.group({
      orderId: this.fb.control('', [Validators.required])
    })
  }

  getOrderId() {
    let orderId = this.orderIdForm.get('orderId').value
    this.orderIdSvc.getOrderDetails(orderId)
      .then(result => {
        this.orderFormDetails = result.map(order => {
          return {
            id: order['id'],
            order_date: order['order_date'],
            customer_id: order['customer_id'],
            total_quantity: order['total_quantity'],
            total_discount: order['total_discount'],
            cost_price: order['cost_price'],
          }
        })
        console.log('result ---> ', result)
      })
  }
}
