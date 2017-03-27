import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Events } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { GamePage } from '../pages';
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
		this.events.subscribe('league:getted', league => {
			this.fixtures =
				_.chain(league.games)
					.groupBy("fixture")
					.toPairs()
					.map(g => {
						return g[1];
					})
					.value();
		});
	}

	gameTapped($event, game) {
		this.navCtrl.parent.parent.push(GamePage, game);
	}

}
