import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AngularFireModule, AuthProviders, AuthMethods } from "angularfire2";

import { MyApp, LogIn } from './app.component';
import {
	HomePage, TeamsPage, TeamHomePage, GamePage, LeaguesPage, ClubHomePage, ClubSheetPage, ClubTeamsPage,
	LeagueHomePage, FixturesPage, LeagueTablePage, TeamGamesPage, MapPage, LogInPage
} from '../pages/pages';

import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';

var config = {
	apiKey: "AIzaSyDDt1G4J74EwBJ5kkCI_bfP0lD3KYwuqI4",
	authDomain: "lp-futbol.firebaseapp.com",
	databaseURL: "https://lp-futbol.firebaseio.com",
	storageBucket: "lp-futbol.appspot.com",
	messagingSenderId: "651803406465"
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
		LogInPage,
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
		AgmCoreModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LogIn,
		HomePage,
		LogInPage,
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
