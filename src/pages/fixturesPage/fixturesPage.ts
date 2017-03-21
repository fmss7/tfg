import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Events } from 'ionic-angular';

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
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		this.events.subscribe('league:getted', games => {
			this.fixtures =
				_.chain(games)
					.groupBy("fixture")
					.toPairs()
					.map(g => { 
						return g[1];
					})
					.value();
		});
	}

}
