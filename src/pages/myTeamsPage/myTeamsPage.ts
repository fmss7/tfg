import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserSettings } from '../../services/userSettings.service';

@Component({
	selector: 'myTeamsPage',
	templateUrl: 'myTeamsPage.html'
})
export class MyTeamsPage {

	myFavoriteTeams: any[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private userSettings: UserSettings) { }

	ionViewDidLoad() {
		this.myFavoriteTeams = this.userSettings.getFavoriteTeams();
	}

}
