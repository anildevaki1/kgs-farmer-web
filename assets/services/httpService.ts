// import { Injectable } from '@angular/core';
// import { HttpClient} from '@angular/common/http';
// import { catchError, throwError } from 'rxjs';
// import { map, retry, timeout } from 'rxjs/operators';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiserviceService {

//   private locationSrc = environment.apiPath;

//   constructor(private http: HttpClient) {}

//   get(url: string, params?: any, headers?: any, responseType: any = 'json') {
//     return this.http.get(this.locationSrc + url, {
//       params,
//       headers: headers || { 'Content-Type': 'application/json' },
//       responseType
//     })
//     .pipe(
//       // timeout({  first:20000  }),
//       // retry(1), // 🔁 try again one time
//     // timeout(20000),
//       map((res: any) => res),
//       catchError(this.errorHandling)
//     );
//   }

//   post(url: string, data: any, params?: any, headers?: any) {
//     return this.http.post(this.locationSrc + url, data, {
//       params,
//       headers: headers || { 'Content-Type': 'application/json' }
//     })
//     .pipe(
//       // timeout({  first:20000  }),
//       map((res: any) => res),
//       catchError(this.errorHandling)
//     );
//   }

//   put(url: string, data: any, params?: any, headers?: any) {
//     return this.http.put(this.locationSrc + url, data, {
//       params,
//       headers: headers || { 'Content-Type': 'application/json' }
//     }).pipe(
//       // timeout({  first:20000  }),
//       map((res: any) => res),
//       catchError(this.errorHandling)
//     );
//   }

//   delete(url: string, params?: any, headers?: any) {
//     return this.http.delete(this.locationSrc + url, {
//       params,
//       headers: headers || { 'Content-Type': 'application/json' }
//     }).pipe(
//       //timeout({  first:20000  }),
//       map((res: any) => res),
//       catchError(this.errorHandling)
//     );
//   }

//   private errorHandling(error: any) {
//     if (error.name === 'TimeoutError') {
//     return throwError(() => new Error('Server taking too long. Please try again.'));
//   }else if (error.status === 0) {
//       return throwError(() => new Error('Network error - Please check your connection.'));
//     } else if (error.status === 400) {
//       return throwError(() => new Error('Bad request - Invalid data provided.'));
//     } else if (error.status === 404) {
//       return throwError(() => new Error('Resource not found.'));
//     } else if (error.status === 500) {
//       return throwError(() => new Error('Server error - Please try again later.'));
//     } else {
//       return throwError(() => new Error('An unexpected error occurred.'));
//     }
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiserviceService {

  private baseUrl = environment.apiPath;
isNative :any;
  constructor(private http: HttpClient) {
     this.isNative = Capacitor.getPlatform() !== 'web';
  }

  // ---------------- GET ----------------
  get(url: string, params?: any, headers?: any): Observable<any> {
    if (this.isNative) {
      return from(this.nativeGet(url, params, headers));
    } else {
      return this.http.get(this.baseUrl + url, {
        params,
        headers: new HttpHeaders(headers || { 'Content-Type': 'application/json' })
      });
    }
  }

  // ---------------- POST ----------------
  post(url: string, data: any, params?: any, headers?: any): Observable<any> {
   if (this.isNative) {
      return from(this.nativePost(url, data, params, headers));
    } else {
      return this.http.post(this.baseUrl + url, data, {
        params,
        headers: new HttpHeaders(headers || { 'Content-Type': 'application/json' })
      });
    }
  }

  // ---------------- PUT ----------------
  put(url: string, data: any, params?: any, headers?: any): Observable<any> {
   if (this.isNative) {
      return from(this.nativePut(url, data, params, headers));
    } else {
      return this.http.put(this.baseUrl + url, data, {
        params,
        headers: new HttpHeaders(headers || { 'Content-Type': 'application/json' })
      });
    }
  }

  // ---------------- DELETE ----------------
  delete(url: string, params?: any, headers?: any): Observable<any> {
   if (this.isNative) {
      return from(this.nativeDelete(url, params, headers));
    } else {
      return this.http.delete(this.baseUrl + url, {
        params,
        headers: new HttpHeaders(headers || { 'Content-Type': 'application/json' })
      });
    }
  }

  // ========== NATIVE ==========
  private async nativeGet(url: string, params?: any, headers?: any) {
    const res = await CapacitorHttp.get({
      url: this.baseUrl + url,
      params: params || {},
      headers: headers || { 'Content-Type': 'application/json' },
     
    });
    return res.data;
  }

  private async nativePost(url: string, data: any, params?: any, headers?: any) {
    const res = await CapacitorHttp.post({
      url: this.baseUrl + url,
      data,
      params: params || {},
      headers: headers || { 'Content-Type': 'application/json' }
    });
    return res.data;
  }

  private async nativePut(url: string, data: any, params?: any, headers?: any) {
    const res = await CapacitorHttp.put({
      url: this.baseUrl + url,
      data,
      params: params || {},
      headers: headers || { 'Content-Type': 'application/json' }
    });
    return res.data;
  }

  private async nativeDelete(url: string, params?: any, headers?: any) {
    const res = await CapacitorHttp.delete({
      url: this.baseUrl + url,
      params: params || {},
      headers: headers || { 'Content-Type': 'application/json' }
    });
    return res.data;
  }
}

