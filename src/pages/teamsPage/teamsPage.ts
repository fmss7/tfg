import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Nav } from 'ionic-angular';

import { TeamHomePage } from '../pages';

import { LPFutbolService } from '../../services/lp-futbol.service';


@Component({
	selector: 'teamsPage',
	templateUrl: 'teamsPage.html'
})
export class TeamsPage {

	teams: any[]

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lPFutbolService: LPFutbolService,
		private loadingController: LoadingController) { }

	ionViewDidLoad() {
		let leagueID = this.navParams.data.id;
		
		let loader = this.loadingController.create({
			content: 'Obteniendo equipos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(leagueID).subscribe(res => this.teams = res);
			loader.dismiss();
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

	teamTapped($event, team) {
		this.navCtrl.push(TeamHomePage, team);
	}

}
