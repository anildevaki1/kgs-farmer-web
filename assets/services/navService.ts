import { inject, Injectable, signal } from '@angular/core';
import { NavController, iosTransitionAnimation } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
type NavigationDirection = 'forward' | 'back';


@Injectable({
  providedIn: 'root'
})
export class navService {
  private navCtrl = inject(NavController);

  navigate = (pageName, params, navigate: NavigationDirection) => navigate == "forward" ? this.navCtrl.navigateForward(pageName, { state: params, animation: iosTransitionAnimation, animated: true, animationDirection: navigate }) : this.navCtrl.navigateBack(pageName, { state: params, animation: iosTransitionAnimation, animated: true, animationDirection: navigate });
  navRoot = (pageName, params, navigate: NavigationDirection) => this.navCtrl.navigateRoot(pageName, { state: params, animation: iosTransitionAnimation, animated: true, animationDirection: navigate });
}



@Injectable({
  providedIn: 'root',
})
export class cacheSrc {
  companyInfo = signal<any>([]);
  async get(name) {
    //const item: any = localPreferences.getItem(obj);
    const item: any = await Preferences.get({ key: name });
    if (item.value) {
      const parsedItem = JSON.parse(item.value);
      return parsedItem;
    }
    return '';
  }

  async set(name, obj) {
    await Preferences.set({ key: name, value: JSON.stringify(obj) });
    //  localPreferences.setItem(name, JSON.stringify(obj));
  }

  async remove(name) {
    await Preferences.remove({ key: name });
  }

  async clear() {
    const { keys } = await Preferences.keys();
    for (const key of keys) {
      if (!key.startsWith('location')) {
        await Preferences.remove({ key });
      }
    }
  }
 
}