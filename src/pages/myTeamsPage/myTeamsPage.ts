import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TeamsPage, TeamHomePage, LeaguesPage } from '../pages';
import { UserSettings } from '../../services/userSettings.service';

@Component({
	selector: 'myTeamsPage',
	templateUrl: 'myTeamsPage.html'
})
export class MyTeamsPage {

	myFavoriteTeams: any[];
	myFavoriteLeagues: any[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private userSettings: UserSettings) { }

	ionViewDidLoad() {
		this.myFavoriteTeams = this.userSettings.getFavoriteTeams();
		this.myFavoriteLeagues = this.userSettings.getFavoriteLeagues();
	}

	goToAllTeams() {
		this.navCtrl.push(TeamsPage);
	}
	
	teamTapped($event, team) {
		this.navCtrl.push(TeamHomePage, team);
	}

	goToAllLeagues(){
		this.navCtrl.push(LeaguesPage);
	}

	leagueTapped($event, league){
		this.navCtrl.push(LeaguesPage, league)
	}

}
