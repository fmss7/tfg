import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { UserSettings } from '../../services/userSettings.service';
import { FirebaseApp } from 'angularfire2';

@Component({
	selector: 'clubSheetPage',
	templateUrl: 'clubSheetPage.html'
})
export class ClubSheetPage {

	user: any;
	club: any;
	address_place: string;
	badgesUrl: string = 'gs://lp-futbol-cfeff.appspot.com/escudos/';
	clubBadgeUrl: string;
	location: any;
	edition: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService,
		private userSettings: UserSettings,
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
			let id_club = this.club.id_club + ".png";
			let storageRefHost = this.firebaseApp.storage().ref().child(`escudos/${id_club}`);
			storageRefHost.getDownloadURL().then(url => {
				this.clubBadgeUrl = url;
				this.events.publish("clubBadge::getted");
			});
			this.events.subscribe("loader::dismiss", () => loader.dismiss());
		});
	}

	ionViewDidEnter() {
		this.userSettings.getLoggedUser();
		this.events.subscribe("user::getted", user => {
			this.user = user;
		});

		this.lPFutbolService.getLocation(this.club.id_location).subscribe(res => {
			this.location = res;
			this.address_place = this.location.address + '. ' + this.location.place;
		});
	}

	updateClubBadgeUrl($event) {
		this.events.subscribe("clubBadge::getted", () => {
			$event.target.src = this.clubBadgeUrl;
			this.events.publish("loader::dismiss");
		});
	}

	editInformation() {
		this.edition = true;
	}

	saveInformation() {
		//let indexOfPoint = this.address_place.lastIndexOf('.');
		//this.location.address = this.address_place.substring(0, indexOfPoint);
		//this.location.place = this.address_place.substring(indexOfPoint + 1);
		this.lPFutbolService.editClub(this.club);
		this.edition = false;
	}

}
