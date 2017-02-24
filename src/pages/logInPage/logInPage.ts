import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'logInPage',
  templateUrl: 'logInPage.html'
})
export class LogInPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }

  goHome(){
	  this.navCtrl.popToRoot();
  }

}
