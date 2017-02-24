import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
//import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { MyApp } from './app.component';
import { HomePage, TeamsPage, TeamHomePage, ClubHomePage, LeagueHomePage, TeamGamesPage,
	LeagueTablePage, GamePage, MapPage, LeaguesPage, FixturesPage, LogInPage} from '../pages/pages';
import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		LogInPage,
		TeamsPage,
		ClubHomePage,
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
		HomePage,
		LogInPage,
		TeamsPage,
		ClubHomePage,
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
