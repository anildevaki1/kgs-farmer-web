import {   Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
 
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AlertsService { 
  constructor(private alertCtrl: AlertController) { }

  async messageBox(message) {
    const alert = await this.alertCtrl.create({
      message: message,
      cssClass: 'messageBox',
      backdropDismiss: false,
      animated: true,
      buttons: ['OK']
    })
    alert.present();
    setTimeout(() => this.animation_box(), 100);

    setTimeout(() => {
      alert.dismiss();
    }, 5000);
  }

  async alert(message) {
    const alert = await this.alertCtrl.create({
      message:  message,
      cssClass: 'alertClass',
      backdropDismiss: false,
      animated: true,
      buttons: [
        {
          text: 'Ok',
          htmlAttributes: {
            'aria-label': 'close'
          }
        }
      ]
    })

    alert.present();

    this.animation_box();
  }

  async messageAlert(header, message) {
    let dataVar = false; // Initialize with a default value
    let oKClicked = false;

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      cssClass: 'messageAlertClass',
      buttons: [
        {
          text: 'Yes',
          role: 'ok',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss();
            oKClicked = true;
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return false;
          }
        }
      ]
    });

    await alert.present();
    this.animation_box();
    await alert.onDidDismiss().then(() => {
      if (oKClicked) {
        dataVar = true;
      }
    });

    return dataVar;
  }

  async confirm(message) {
    let dataVar = false; // Initialize with a default value
    let oKClicked = false;
    const alert = await this.alertCtrl.create({
      cssClass: 'confirmClass',
      message:   message,
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
            return false;
          }
        },
        {
          text: 'Ok',
          handler: () => {
            oKClicked = true;
          }
        }
      ]
    });

    await alert.present();
    this.animation_box();
    await alert.onDidDismiss().then(() => {
      if (oKClicked) {
        dataVar = true;
      }
    });

    return dataVar;
  }

  animation_box() {
    const alertEl = document.querySelector('.alert-wrapper') as HTMLElement;

    // Initially set it below the screen
    gsap.set(alertEl, { y: '100%', opacity: 0 });

    // Animate it upwards
    gsap.to(alertEl, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    });
  }

}
