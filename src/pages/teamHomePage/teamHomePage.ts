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
	data: any;
	teamGamesTab = TeamGamesPage;
	leagueTableTab = LeagueTablePage;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
		this.team = this.navParams.data;
		this.data = {
			"id_league": this.team.league.id_league,
			"id_team": this.team.id_team
		}
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			spinner: 'bubbles',
			content: 'Obteniendo partidos...',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(this.team.league.id_league).subscribe(league => {
				this.events.publish('league(Team):getted', league);
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
