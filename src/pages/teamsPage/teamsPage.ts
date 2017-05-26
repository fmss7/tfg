import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { TeamHomePage, ClubHomePage } from '../pages';
import { LPFutbolService } from '../../services/lp-futbol.service';
import * as _ from 'lodash';

@Component({
	selector: 'teamsPage',
	templateUrl: 'teamsPage.html'
})

export class TeamsPage {

	clubsShow: boolean[];
	clubs: any[];
	allClubs: any[];
	queryText: string = '';
	filteredClubs: boolean = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lPFutbolService: LPFutbolService,
		private loadingController: LoadingController) { }

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo equipos...',
			spinner: 'bubbles',
			cssClass: 'loadingController',
			duration: 3000
		});
		loader.present().then(() => {
			this.lPFutbolService.getAllClubs().subscribe(clubs => {
				let aux = [];
				_.forEach(clubs, club =>{
					aux.push(club);
				});
				this.clubs = aux;
				for (let club of this.clubs) {
					club["showTeams"] = false;
				}
				this.allClubs = this.clubs;
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

	updateTeams() {
		if (this.queryText.length > 2) {
			let queryTextLower = this.queryText.toLowerCase();
			this.clubs = _.filter(this.allClubs, c => c.name.toLowerCase().includes(queryTextLower));
			if(this.clubs.length == 0){
				this.filteredClubs = false;
			}else{
				this.filteredClubs = true;
			}
		} else {
			this.clubs = this.allClubs;
			this.filteredClubs = true;
		}
	}

}
