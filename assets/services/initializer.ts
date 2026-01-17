import { inject, Injectable } from '@angular/core';
import { ApiserviceService } from './httpService';
import { AlertsService } from './alerts.service';
import { cacheSrc } from './navService';
import { shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class placesService {
    private apiSrc = inject(ApiserviceService);
    private alertSrc = inject(AlertsService);
    private storage = inject(cacheSrc);
        
    /**
     * Load places data
     */
    initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.apiSrc.get("FarmerVisitPlace/Place", null, { 'content-type': 'application/json' })
            .pipe(
                 shareReplay({ bufferSize: 1, refCount: true })
            )
            .subscribe({
                next: (res: any) => {
                    this.storage.companyInfo.set(res);
                    resolve();
                },
                error: (err) => {
                    this.alertSrc.alert(err.message);
                    reject(err);
                }
            });
        });
    }
 
}