import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams, Events, Slides, AlertController, ToastController } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { UserSettings } from '../../services/userSettings.service';
import { GamePage } from '../pages';
import * as _ from 'lodash';

@Component({
	selector: 'fixturesPage',
	templateUrl: 'fixturesPage.html'
})

export class FixturesPage {

	@ViewChild(Slides) slides: Slides;
	fixtures: any;
	id_league: any;
	league: any;
	isFollowing: boolean = false;
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
		private userSettings: UserSettings,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService,
		private alertController: AlertController,
		private toastController: ToastController) {
		this.id_league = this.navParams.data;
	}

	ionViewDidLoad() {
		this.userSettings.isFavourite(this.id_league).then(value => this.isFollowing = value);
		this.lPFutbolService.getLeagueData(this.id_league).subscribe(league => {
			this.league = {
				"id_league": this.id_league,
				"name": league.name,
				"category": league.category
			}
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

	toggleFollow() {
		if (this.isFollowing) {
			let confirm = this.alertController.create({
				title: this.league.name,
				message: '¿Quieres dejar de seguir a esta liga?',
				buttons: [
					{
						text: 'Si',
						handler: () => {
							this.userSettings.unFavoriteLeague(this.id_league);
							this.isFollowing = false;
							let toast = this.toastController.create({
								message: 'Has dejado de seguir a esta liga',
								duration: 1250,
								position: 'bottom'
							});
							toast.present();
						}
					},
					{ text: 'No' }
				]
			});
			confirm.present();
		} else {
			this.isFollowing = true;
			this.userSettings.addFavoriteLeague(this.league);
			let toast = this.toastController.create({
				message: 'Has empezado a seguir a esta liga',
				duration: 1250,
				position: 'bottom'
			});
			toast.present();
		}
	}

}
