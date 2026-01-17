import {  Injectable } from '@angular/core';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class AppUpdateService { 
  async checkForUpdate() {
     if (!Capacitor.isNativePlatform()) {
        console.log('⚠ Not native platform');
        return false;
      }
    const result = await AppUpdate.getAppUpdateInfo();
    const available = result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE;
    if (!available) {
      console.log('✅ App is up to date');
    }
    return available;
  } catch(err) {
    console.error('Update check failed', err);
    return false;
  }



  // async clearIfVersionChanged() {
  //   const current = await App.getInfo(); // e.g. versionName: '1.2.3'
  //   const saved = await this.storage.get('app_version');

  //   if (saved !== current.version) {
  //     // Version changed → clear storage
  //     await this.storage.clear();
  //     // Save new version
  //     await this.storage.set('app_version', current.version);
  //   }
  // }


  async showUpdateDialog() {

    const appInfo = await App.getInfo();

    await Browser.open({
      url: `https://play.google.com/store/apps/details?id=${appInfo.id}`
    });

  }
}
