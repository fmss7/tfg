import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';

@Component({
	selector: 'clubSheetPage',
	templateUrl: 'clubSheetPage.html'
})
export class ClubSheetPage {

	club: any;
	location: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) {
		}

	ionViewDidLoad() {
		this.club = this.navParams.data;
		let loader = this.loadingController.create({
			content: 'Obteniendo club...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLocation(this.club.id_location).subscribe(res => {
				this.location = res;
			});
			loader.dismiss();
		});
	}

}
