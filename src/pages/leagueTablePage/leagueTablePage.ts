import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UserSettings } from '../../services/userSettings.service';
import * as _ from 'lodash';

@Component({
	selector: 'leagueTablePage',
	templateUrl: 'leagueTablePage.html'
})

export class LeagueTablePage {

	league: any;
	teams: any = {};
	leagueTable: any[] = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private userSettings: UserSettings) {
	}

	ionViewDidLoad() {
		this.league = this.userSettings.getLeagueData();
		this.league.teams.forEach(element => {
			let team = element.name;
			this.teams[team] = {"name": team, "wins": 0, "draws": 0, "losses": 0, "goalsFor": 0, "goalsAgainst": 0, "goalsDiff": 0, "points": 0 };
		});
		_.forEach(this.league.games, game => {
			if (game.hostGoals > game.guestGoals) {
				this.teams[game.host].wins++;
				this.teams[game.host].points += 3;
				this.teams[game.guest].losses++;
			} else if (game.hostGoals < game.guestGoals) {
				this.teams[game.host].losses++;
				this.teams[game.guest].wins++;
				this.teams[game.guest].points += 3;
			} else {
				this.teams[game.host].draws++;
				this.teams[game.guest].points++;
				this.teams[game.guest].draws++;
				this.teams[game.guest].points++;
			}
			this.teams[game.host].goalsFor += game.hostGoals
			this.teams[game.host].goalsAgainst += game.guestGoals;
			this.teams[game.host].goalsDiff += game.hostGoals - game.guestGoals;
			this.teams[game.guest].goalsFor += game.guestGoals
			this.teams[game.guest].goalsAgainst += game.hostGoals;
			this.teams[game.guest].goalsDiff += game.guestGoals - game.hostGoals;
		});

		this.teams = _.orderBy(this.teams, ['points', 'goalsDiff'], ['desc', 'desc']);
		_.forEach(this.teams, team => this.leagueTable.push(team));
		/*
		this.events.subscribe('league:getted', league => {
			this.league = league;
		});
		*/
	}

}
