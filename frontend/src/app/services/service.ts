import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable()
export class OrderIdService {
  // what is this for?
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  })
}

constructor(private http: HttpClient) {}

async getOrderDetails(orderId: string): Promise<any> {
    const response = await this.http.get<any>(`${environment.apiUrl}/${orderId}`)
    .toPromise()
    // must comment out, else order-id-form.component don't work
    // .then(result => {
    //   console.log('result --->', result)
    // })
    .catch((error: HttpErrorResponse) => {
      console.log('HttpError ---> ', error)
    })
    return response
}
}