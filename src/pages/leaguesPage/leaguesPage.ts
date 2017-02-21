import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { TeamsPage } from '../../pages/pages';

import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'leaguesPage',
	templateUrl: 'leaguesPage.html'
})
export class LeaguesPage {

	categories: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {

		let loader = this.loadingController.create({
			content: 'Obteniendo categorías...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getAllCategories().subscribe(res => this.categories = res);
			loader.dismiss();
		});
	}

	leagueTapped($event, league){
		this.navCtrl.push(TeamsPage, league);
	}

}
