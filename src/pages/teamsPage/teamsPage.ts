import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { TeamHomePage, ClubHomePage } from '../pages';

import { LPFutbolService } from '../../services/lp-futbol.service';


@Component({
	selector: 'teamsPage',
	templateUrl: 'teamsPage.html'
})

export class TeamsPage {

	clubs: any[];
	queryText: string = '';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lPFutbolService: LPFutbolService,
		private loadingController: LoadingController) { }

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo equipos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getAllClubs().subscribe(res => this.clubs = res);
			loader.dismiss();
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

	teamTapped($event, team) {
		this.navCtrl.push(TeamHomePage, team);
	}

	clubTapped($event, club) {
		this.navCtrl.push(ClubHomePage, club);
	}

	toggleGroup(group) {
		group.show = !group.show;
	};
	isGroupShown(group) {
		return group.show;
	};

}
