import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { GamePage } from '../../pages/pages';

import * as _ from 'lodash';

@Component({
	selector: 'teamGamesPage',
	templateUrl: 'teamGamesPage.html'
})
export class TeamGamesPage {

	team: any;
	games: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController) { }

	ionViewDidLoad() {
		this.events.subscribe('league:getted', (league, team) => {
			this.team = team;
			this.games = _.chain(league.games)
				.filter(g => g.host == this.team.name || g.guest == this.team.name)
				.map(g => {
					let isTeam1 = (g.host === this.team.name);
					let opponentName = isTeam1 ? g.guest : g.host;
					let goalsDisplay = this.getGoalsDisplay(isTeam1, g.hostGoals, g.guestGoals);
					return {
						fixture: g.fixture,
						host: g.host,
						hostGoals: g.hostGoals,
						guestGoals: g.guestGoals,
						guest: g.guest,
						opponent: opponentName,
						date: g.date,
						time: g.time,
						id_location: g.id_location,
						goalsDisplay: goalsDisplay,
					}
				})
				.value();
		});
	}

	getGoalsDisplay(isTeam1, hostGoals, guestGoals) {
		if (hostGoals >= 0 && guestGoals >= 0) {
			var teamGoals = (isTeam1 ? hostGoals : guestGoals)
			var opponentGoals = (isTeam1 ? guestGoals : hostGoals);
			var winIndicator;
			if (teamGoals > opponentGoals) {
				winIndicator = 'V';
			} else if (teamGoals < opponentGoals) {
				winIndicator = 'D';
			} else {
				winIndicator = 'E';
			}
			return winIndicator;
		} else {
			return "";
		}
	}

	getGoalsDisplayBadgeClass(game) {
		if (game.goalsDisplay.indexOf('V') === 0) {
			return 'secondary';
		} else if (game.goalsDisplay.indexOf('D') === 0) {
			return 'danger';
		} else {
			return 'warning';
		}
	}

	gameTapped($event, game) {
		this.navCtrl.parent.parent.push(GamePage, game);
	}

}