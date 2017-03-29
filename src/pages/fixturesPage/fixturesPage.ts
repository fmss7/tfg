import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams, Events, Slides } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { GamePage } from '../pages';
import * as _ from 'lodash';

@Component({
	selector: 'fixturesPage',
	templateUrl: 'fixturesPage.html'
})

export class FixturesPage {
	@ViewChild(Slides) slides: Slides;
	fixtures: any;
	mySlideOptions: any = {
		initialSlide: 0,
		speed: 3000,
		loop: true,
		pager: true
	};

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		this.events.subscribe('league(League):getted', league => {
			this.fixtures =
				_.chain(league.games)
					.groupBy("fixture")
					.toPairs()
					.map(g => {
						return g[1];
					})
					.value();
			let x = 0;
			_.forEach(this.fixtures, f => {
				_.forEach(f, game => {
					if (game.hostGoals >= 0 && game.guestGoals >= 0) {
						this.mySlideOptions.initialSlide = x;
					}
				});
				x++;
			});
		});
	}

	gameTapped($event, game) {
		this.navCtrl.parent.parent.push(GamePage, game);
	}

}
