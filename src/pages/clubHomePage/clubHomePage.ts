import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { ClubSheetPage, ClubTeamsPage } from '../pages';

@Component({
	selector: 'clubHomePage',
	templateUrl: 'clubHomePage.html'
})
export class ClubHomePage {

	club: any;
	clubSheetTab = ClubSheetPage;
	clubTeamsTab = ClubTeamsPage;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events) {
		this.club = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
