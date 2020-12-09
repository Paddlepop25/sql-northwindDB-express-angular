import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { OrderModel } from '../models/order.model'

@Injectable()
export class OrderIdService {
  // what is this for?
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',  // request (POST)
      'Accept': 'application/json' // response (GET)
  })
}

constructor(private http: HttpClient) {}

async getOrderDetails(orderId: string): Promise<any> {
    const response = await this.http.get<any>(`${environment.apiUrl}/${orderId}`, this.httpOptions)
    .toPromise()
    // must comment out, else order-id-form.component don't work
    // .then(result => {
    //   console.log('result --->', result)
    // })

    // .then(result => {
    //   console.log('result --->', result) // can get details
    //    result.map(order => {
    //     return {
    //       id: order['id'],
    //       order_date: order['order_date'],
    //       customer_id: order['customer_id'],
    //       total_quantity: order['total_quantity'],
    //       total_discount: order['total_discount'],
    //       cost_price: order['cost_price'],
    //     } as OrderModel
    //   })
    //   return result
    // })

    .catch((error: HttpErrorResponse) => {
      console.log('HttpError ---> ', error)
    })
    return response
}
}