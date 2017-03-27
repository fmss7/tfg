import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { TeamGamesPage, LeagueTablePage } from '../pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'teamHomePage',
	templateUrl: 'teamHomePage.html'
})

export class TeamHomePage {

	team: any;
	league: any;
	teamGamesTab = TeamGamesPage;
	leagueTableTab = LeagueTablePage;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo equipos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.team = this.navParams.data;
			this.lPFutbolService.getLeagueData(this.team.league.id_league).subscribe(res => {
				this.league = res;
				this.events.publish('league:getted', this.league, this.team);
			});
			loader.dismiss();
		});
	}

	goHome() {
		this.navCtrl.popToRoot(
			{
				animate: true,
				animation: "wp-transition",
				direction: "back",
			});
	}
}
