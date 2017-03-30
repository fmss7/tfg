import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LeagueHomePage }  from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'leaguesPage',
	templateUrl: 'leaguesPage.html'
})
export class LeaguesPage {

	categories: any;
	queryText: string = '';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo categorías...',
			spinner: 'bubbles',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			this.lPFutbolService.getAllCategories().subscribe(res => this.categories = res);
			loader.dismiss();
		});
	}

	leagueTapped($event, league) {
		this.navCtrl.push(LeagueHomePage, league);
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
