import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

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

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(this.navParams.data.id).subscribe(res => {
				this.league = res;
			});
			loader.dismiss();
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
