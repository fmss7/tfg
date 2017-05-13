import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Events } from 'ionic-angular';
import { FixturesPage, LeagueTablePage } from '../pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'leagueHomePage',
	templateUrl: 'leagueHomePage.html'
})
export class LeagueHomePage {

	league: any;
	fixturesTab = FixturesPage;
	leagueTableTab = LeagueTablePage;
	data: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
		this.league = this.navParams.data;
		this.data = {
			"id_league": this.league.id_league,
			"id_team": ""
		}
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			spinner: 'bubbles',
			content: 'Obteniendo datos...',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(this.league.id_league).subscribe(league => {
				//this.events.publish('league(League):getted', league);
				loader.dismiss();
			});
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
