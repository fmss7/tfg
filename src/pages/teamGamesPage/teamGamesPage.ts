import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GamePage } from '../../pages/pages';

@Component({
	selector: 'teamGamesPage',
	templateUrl: 'teamGamesPage.html'
})
export class TeamGamesPage {

	team: any;
	private date;

	constructor(public navCtrl: NavController, public navParams: NavParams) { }

	ionViewDidLoad() {
		this.team = this.navParams.data;
		this.date = new Date();
	}

    gameTapped($event, team) {
        //let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
        this.navCtrl.parent.parent.push(GamePage, this.team);
    }

}
