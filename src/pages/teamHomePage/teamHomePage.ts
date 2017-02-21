import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TeamMatchesPage, TeamLeagueTablePage } from '../pages';

@Component({
	selector: 'teamHomePage',
	templateUrl: 'teamHomePage.html'
})

export class TeamHomePage {

	team: any;
	teamMatchesTab = TeamMatchesPage;
	leagueTableTab = TeamLeagueTablePage;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.team = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
