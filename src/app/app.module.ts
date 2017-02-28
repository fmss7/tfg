import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { MyApp, LogIn} from './app.component';
import {
	HomePage, TeamsPage, TeamHomePage, GamePage, LeaguesPage, ClubHomePage, ClubSheetPage, ClubTeamsPage,
	LeagueHomePage, FixturesPage, LeagueTablePage, TeamGamesPage, MapPage, LogInPage
} from '../pages/pages';
import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';

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
