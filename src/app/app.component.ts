import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MyTeamsPage } from '../pages/pages';
import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';

@Component({
	templateUrl: 'app.html',
	providers: [
		UserSettings,
		HttpModule
	]
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	favoriteTeams: any[];
	rootPage: any = MyTeamsPage;

	constructor(
		public platform: Platform,
		private userSettings: UserSettings) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
		this.favoriteTeams = this.userSettings.getFavoriteTeams();
	}

}
