import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { TeamHomePage, ClubHomePage } from '../pages';

import { LPFutbolService } from '../../services/lp-futbol.service';


@Component({
	selector: 'teamsPage',
	templateUrl: 'teamsPage.html'
})

export class TeamsPage {

	aux: boolean = true;
	clubsShow: boolean[];
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
			spinner: 'bubbles',
			//cssClass: 'loading-wrapper'
		});
		loader.present().then(() => {
			this.lPFutbolService.getAllClubs().subscribe(res => {
				this.clubs = res;
				for (let club of this.clubs) {
					club["showTeams"] = false;
				}
				loader.dismiss();
			});
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

	toogleShowTeams(club) {
		club.showTeams = !club.showTeams;
	}
	showTeams(club) {
		return club.showTeams;
	}


}
