import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'clubHomePage',
	templateUrl: 'clubHomePage.html'
})
export class ClubHomePage {

	club: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.club = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
