import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AngularFireModule, AuthProviders, AuthMethods } from "angularfire2";
import { Storage } from '@ionic/storage';
import { MyApp, LogIn } from './app.component';
import {
	HomePage, TeamsPage, TeamHomePage, GamePage, LeaguesPage, ClubHomePage, ClubSheetPage, ClubTeamsPage,
	LeagueHomePage, FixturesPage, LeagueTablePage, TeamGamesPage, MapPage, SignInPage, UserPage
} from '../pages/pages';
import { CustomPipe } from '../pages/fixturesPage/customPipe.pipe';

import { UserSettings } from '../services/userSettings.service';
import { LPFutbolService } from '../services/lp-futbol.service';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

export const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'f346b93e'
  },
  'push': {
    'sender_id': '679651523148',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

export const firebaseConfig = {
	apiKey: "AIzaSyC1LaYV7V3YafjF5SIMbGbSBxFazR22dbM",
	authDomain: "lp-futbol-cfeff.firebaseapp.com",
	databaseURL: "https://lp-futbol-cfeff.firebaseio.com",
	storageBucket: "lp-futbol-cfeff.appspot.com",
	messagingSenderId: "679651523148"
};
export const myFirebaseAuthConfig = {
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
		CustomPipe,
		GamePage,
		MapPage,
		SignInPage,
		UserPage
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
		CloudModule.forRoot(cloudSettings),
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
		MapPage,
		SignInPage,
		UserPage
	],
	providers:
	[{ provide: ErrorHandler, useClass: IonicErrorHandler },
		UserSettings,
		LPFutbolService,
		Storage,
		StatusBar,
		SplashScreen
	]
})
export class AppModule { }
