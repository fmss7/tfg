import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FixturesPage, LeagueTablePage } from '../pages';

@Component({
	selector: 'leagueHomePage',
	templateUrl: 'leagueHomePage.html'
})
export class LeagueHomePage {

	league: any;
	fixturesTab = FixturesPage;
	leagueTableTab = LeagueTablePage;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.league = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
