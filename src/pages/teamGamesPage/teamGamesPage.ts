import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { GamePage } from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

import * as _ from 'lodash';

@Component({
	selector: 'teamGamesPage',
	templateUrl: 'teamGamesPage.html'
})
export class TeamGamesPage {

	team: any;
	games: any;
	private date;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingController: LoadingController,
		public lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {
		this.team = this.navParams.data;
		this.date = new Date();
		console.log(this.team.name);
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLeagueData(this.team.leagueId).subscribe(league => {
				this.games = _.chain(league.fixtures)
					.filter(f => f.host == this.team.name || f.guest == this.team.name)
					.map(f => {
						let isTeam1 = (f.host === this.team.name);
						let opponentName = isTeam1 ? f.guest : f.host;
						let GoalsDisplay = this.getGoalsDisplay(isTeam1, f.hostGoals, f.guestGoals);
						return {
							host: f.host,
							hostGoals: f.hostGoals,
							guestGoals: f.guestGoals,
							guest: f.guest,
							opponent: opponentName,
							date: f.date,
							time: f.hour,
							location: f.location,
							GoalsDisplay: GoalsDisplay,
						}
					})
					.value();
				//console.log(this.games);
			});
			loader.dismiss();
		});

	}
	getGoalsDisplay(isTeam1, hostGoals, guestGoals) {
		if (hostGoals && guestGoals) {
			var teamGoals = (isTeam1 ? hostGoals : guestGoals)
			var opponentGoals = (isTeam1 ? guestGoals : hostGoals);
			var winIndicator;
			if(teamGoals > opponentGoals){
				winIndicator = 'Victoria';
			}else if(teamGoals < opponentGoals){
				winIndicator = 'Derrota';
			}else{
				winIndicator = 'Eempate';
			}
			return winIndicator + teamGoals + "-" + opponentGoals;
		} else {
			return "";
		}
	}
	gameTapped($event, team) {
		//let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
		this.navCtrl.parent.parent.push(GamePage, this.team);
	}

}