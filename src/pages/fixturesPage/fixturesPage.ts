import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { LPFutbolService } from '../../services/lp-futbol.service';

import * as _ from 'lodash';

@Component({
	selector: 'fixturesPage',
	templateUrl: 'fixturesPage.html'
})
export class FixturesPage {

	fixtures: any;

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
			this.lPFutbolService.getLeagueData("reg-pref").subscribe(res => {
				this.fixtures =
					_.chain(res.games)
						.groupBy("fixture")
						.toPairs()
						.map(g => { return g[1] })
						.value();
				console.log(this.fixtures);
			});
			loader.dismiss();
		});
	}

}
