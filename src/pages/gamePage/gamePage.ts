import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapPage } from '../../pages/pages';

@Component({
	selector: 'gamePage',
	templateUrl: 'gamePage.html'
})
export class GamePage {

	team: any;

	constructor(
		public navCtrl: NavController, public navParams: NavParams) { }

	ionViewDidLoad() {
		this.team = this.navParams.data;
		//this.game.gameTime = Date.parse(this.game.time);
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

	goToMap() {
		this.navCtrl.push(MapPage, this.team);
	}

}
