import { Component } from '@angular/core';
import { NavController, Events} from 'ionic-angular';

import { TeamsPage, TeamHomePage, LeaguesPage, LeagueHomePage } from '../pages';
import { UserSettings } from '../../services/userSettings.service';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'homePage',
	templateUrl: 'homePage.html'
})
export class HomePage {

	myFavoriteTeams = [];
	myFavoriteLeagues = [];

	constructor(
		public navCtrl: NavController,
		private userSettings: UserSettings,
		private events: Events,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		this.refreshFavorites();
		this.events.subscribe('favorites:changed', () => this.refreshFavorites());
	}

	refreshFavorites() {
		this.myFavoriteTeams = this.userSettings.getFavoriteTeams();
		this.myFavoriteLeagues = this.userSettings.getFavoriteLeagues();
	}

	goToAllTeams() {
		this.navCtrl.push(TeamsPage);
	}

	teamTapped($event, team) {
		this.navCtrl.push(TeamHomePage, team);
	}

	goToAllLeagues() {
		this.navCtrl.push(LeaguesPage);
	}

	leagueTapped($event, league) {
		this.navCtrl.push(LeagueHomePage, league)
	}

}
