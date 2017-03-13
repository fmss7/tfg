import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TeamGamesPage, LeagueTablePage } from '../pages';

import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'teamHomePage',
	templateUrl: 'teamHomePage.html'
})

export class TeamHomePage {

	team: any;
	league: any;
	teamGamesTab = TeamGamesPage;
	leagueTableTab = LeagueTablePage;

	constructor(public navCtrl: NavController, public navParams: NavParams, private lPFutbolService: LPFutbolService) {
		this.team = this.navParams.data;
	}

	ionViewDidLoad() {
		this.lPFutbolService.getLeagueData(this.team.league.id).subscribe(res => this.league = res);
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
