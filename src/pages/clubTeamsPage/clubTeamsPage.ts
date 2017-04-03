import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeamHomePage } from '../pages';

@Component({
	selector: 'clubTeamsPage',
	templateUrl: 'clubTeamsPage.html'
})
export class ClubTeamsPage {

	teams: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) { }

	ionViewDidLoad() {
		this.teams = this.navParams.data.teams;
	}

	teamTapped($event, team) {
		this.navCtrl.parent.parent.push(TeamHomePage, team);
	}

}
