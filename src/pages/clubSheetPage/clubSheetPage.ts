import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { FirebaseApp } from 'angularfire2';

@Component({
	selector: 'clubSheetPage',
	templateUrl: 'clubSheetPage.html'
})
export class ClubSheetPage {

	club: any;
	badgesUrl: string = 'gs://lp-futbol-cfeff.appspot.com/escudos/';
	clubBadgeUrl: string;
	location: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService,
		@Inject(FirebaseApp) private firebaseApp: any) {
		this.club = this.navParams.data;

	}

	ionViewDidLoad() {

		let loader = this.loadingController.create({
			content: 'Obteniendo club...',
			spinner: 'bubbles',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			let club = this.club.id_club + ".png";
			let storageRefHost = this.firebaseApp.storage().ref().child('escudos/' + club);
			storageRefHost.getDownloadURL().then(url => {
				this.clubBadgeUrl = url;
				this.events.publish('clubBadge:getted');
			});
			this.lPFutbolService.getLocation(this.club.id_location).subscribe(res => {
				this.location = res;
			});
			this.events.subscribe('loader:dismiss', () => loader.dismiss());
		});
	}

	updateClubBadgeUrl($event) {
		this.events.subscribe('clubBadge:getted', () => {
			$event.target.src = this.clubBadgeUrl;
			this.events.publish('loader:dismiss');
		});
	}

}
