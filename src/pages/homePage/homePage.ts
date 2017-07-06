import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { TeamsPage, TeamHomePage, LeaguesPage, LeagueHomePage } from '../pages';
import { UserSettings } from '../../services/userSettings.service';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'homePage',
	templateUrl: 'homePage.html'
})

export class HomePage {

	favoriteTeams = [];
	favoriteLeagues = [];
	user: any;

	constructor(
		public navCtrl: NavController,
		private userSettings: UserSettings,
		private events: Events,
		private lPFutbolService: LPFutbolService) {
	}

	ionViewDidLoad() {
		this.refreshFavorites();
		this.events.subscribe('favorites:changed', () => this.refreshFavorites());
		this.refreshUser();
		this.events.subscribe('user:changed', () => this.refreshUser());
	}

	ionViewDidEnter() {
		/*
		this.userSettings.getLoggedUser();
		this.events.subscribe("user::getted", user => {
			console.log(user);
		});
		*/
	}

	refreshFavorites() {
		this.userSettings.getFavoriteTeams();
		this.events.subscribe("favoriteTeams:getted", favoriteTeams => {
			this.favoriteTeams = favoriteTeams;
		});

		this.userSettings.getFavoriteLeagues();
		this.events.subscribe("favoriteLeagues:getted", favoriteLeagues => {
			this.favoriteLeagues = favoriteLeagues;
		});
	}

	refreshUser() {
		this.userSettings.getLoggedUser();
		this.events.subscribe("user::getted", user => {
			this.user = user;
			this.refreshFavorites();
		});
	}

	teamTapped($event, team) {
		this.navCtrl.push(TeamHomePage, team);
	}

	leagueTapped($event, league) {
		this.navCtrl.push(LeagueHomePage, league)
	}

}
