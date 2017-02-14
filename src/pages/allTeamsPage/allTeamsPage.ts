import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LPFutbolService } from '../../services/lp-futbol.service';


@Component({
	selector: 'allTeamsPage',
	templateUrl: 'allTeamsPage.html'
})
export class AllTeamsPage {

	allTeams: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {
		this.lPFutbolService.getAllTeams().then(data => this.allTeams = data);
	}

}
