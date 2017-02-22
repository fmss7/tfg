import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'leagueHomePage',
	templateUrl: 'leagueHomePage.html'
})
export class LeagueHomePage {

	league: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.league = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
