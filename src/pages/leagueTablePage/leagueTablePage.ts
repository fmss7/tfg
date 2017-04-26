import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { TeamHomePage } from '../../pages/pages';
import { UserSettings } from '../../services/userSettings.service';
import { LPFutbolService } from '../../services/lp-futbol.service';
import * as _ from 'lodash';

@Component({
	selector: 'leagueTablePage',
	templateUrl: 'leagueTablePage.html'
})

export class LeagueTablePage {

	league: any;
	id_league: any;
	id_team: any;
	teams: any = {};
	leagueTable: any[] = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private userSettings: UserSettings,
		private lPFutbolService: LPFutbolService) {
		this.id_league = this.navParams.data.id_league;
		this.id_team = this.navParams.data.id_team;
	}

	ionViewDidLoad() {
		this.lPFutbolService.getLeagueData(this.id_league).subscribe(league => {
			this.league = league;
			this.league.teams.forEach(element => {
				let team = element.name;
				this.teams[team] = { "name": team, "id_team": element.id_team, "wins": 0, "draws": 0, "losses": 0, "goalsFor": 0, "goalsAgainst": 0, "goalsDiff": 0, "points": 0 };
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
				if (game.hostGoals >= 0 && game.guestGoals >= 0) {
					this.teams[game.host].goalsFor += game.hostGoals
					this.teams[game.host].goalsAgainst += game.guestGoals;
					this.teams[game.host].goalsDiff += game.hostGoals - game.guestGoals;
					this.teams[game.guest].goalsFor += game.guestGoals
					this.teams[game.guest].goalsAgainst += game.hostGoals;
					this.teams[game.guest].goalsDiff += game.guestGoals - game.hostGoals;
				}
			});
			this.teams = _.orderBy(this.teams, ['points', 'goalsDiff'], ['desc', 'desc']);
			_.forEach(this.teams, (team, index) => { this.leagueTable.push(team) });
			this.events.publish('position:getted', _.findIndex(this.leagueTable, team => { return team.id_team == this.id_team }));
		});
	}

	color(id_team) {
		if (id_team == this.id_team) {
			return 'cornflowerblue';
		}
	}
	fontWeight(id_team) {
		if (id_team == this.id_team) {
			return 'bold';
		}
	}

	teamTapped(id_team) {
		let league = this.lPFutbolService.getCurrentLeague();
		let team = league.teams.find(t => t.id_team === id_team);
		this.navCtrl.parent.parent.push(TeamHomePage, team);
	}

}
