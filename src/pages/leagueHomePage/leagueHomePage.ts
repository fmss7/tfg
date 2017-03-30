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
	id_league: any;
	fixturesTab = FixturesPage;
	leagueTableTab = LeagueTablePage;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
		this.id_league = this.navParams.data.id_league;
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			spinner: 'bubbles',
			content: 'Obteniendo datos...',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(this.id_league).subscribe(res => {
				this.league = res;
				this.events.publish('league(League):getted', this.league);
				loader.dismiss();
			});
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
