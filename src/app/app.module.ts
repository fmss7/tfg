import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AngularFireModule, AuthProviders, AuthMethods } from "angularfire2";

import { MyApp, LogIn } from './app.component';
import {
	HomePage, TeamsPage, TeamHomePage, GamePage, LeaguesPage, ClubHomePage, ClubSheetPage, ClubTeamsPage,
	LeagueHomePage, FixturesPage, LeagueTablePage, TeamGamesPage, MapPage
} from '../pages/pages';

import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';

export const firebaseConfig = {
    apiKey: "AIzaSyA5y-qruOF0GUHQ9rKmTSK1cYHy2tkf9vA",
    authDomain: "lp-futbol-777.firebaseapp.com",
    databaseURL: "https://lp-futbol-777.firebaseio.com",
    storageBucket: "lp-futbol-777.appspot.com",
    messagingSenderId: "438579790140"
};
const myFirebaseAuthConfig = {
	provider: AuthProviders.Password,
	method: AuthMethods.Password
};


@NgModule({
	declarations: [
		MyApp,
		LogIn,
		HomePage,
		TeamsPage,
		ClubHomePage,
		ClubSheetPage,
		ClubTeamsPage,
		LeaguesPage,
		TeamHomePage,
		LeagueHomePage,
		TeamGamesPage,
		LeagueTablePage,
		FixturesPage,
		GamePage,
		MapPage
	],
	imports: [
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
		AgmCoreModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LogIn,
		HomePage,
		TeamsPage,
		ClubHomePage,
		ClubSheetPage,
		ClubTeamsPage,
		LeaguesPage,
		TeamHomePage,
		LeagueHomePage,
		TeamGamesPage,
		LeagueTablePage,
		FixturesPage,
		GamePage,
		MapPage
	],
	providers:
	[{ provide: ErrorHandler, useClass: IonicErrorHandler },
		UserSettings,
		LPFutbolService
	]
})
export class AppModule { }
