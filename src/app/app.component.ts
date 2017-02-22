import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage, TeamHomePage, LeagueHomePage } from '../pages/pages';
import { UserSettings } from '../services/userSettings.service';
//import { LPFutbolService } from '../services/lp-futbol.service';

@Component({
	templateUrl: 'app.html', providers: [UserSettings, HttpModule]
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	favoriteTeams: any[];
	favoriteLeagues: any[];
	rootPage: any = HomePage;

	constructor(public platform: Platform, private userSettings: UserSettings, private loadingController: LoadingController) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
		this.favoriteTeams = this.userSettings.getFavoriteTeams();
		this.favoriteLeagues = this.userSettings.getFavoriteLeagues();
	}

	teamTapped($event, fav) {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			dismissOnPageChange: true
		});
		loader.present();
		this.nav.push(TeamHomePage, fav);
	}
	
	leagueTapped($event, fav) {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			dismissOnPageChange: true
		});
		loader.present();
		this.nav.push(LeagueHomePage, fav);
	}

}
