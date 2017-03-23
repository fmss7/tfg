import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { MapPage } from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

declare var window: any;

@Component({
	selector: 'gamePage',
	templateUrl: 'gamePage.html'
})
export class GamePage {

	game: any;
	flag: boolean = false;
	storage: any;
	badgesUrl: string = 'gs://lp-futbol-cfeff.appspot.com/escudos/';
	hostBadgeUrl: string;
	guestBadgeUrl: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService,
		@Inject(FirebaseApp) private firebaseApp: any) {

	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.game = this.navParams.data;
			let host = this.game.id_host.substring(0, this.game.id_host.indexOf('@')) + ".png";
			let guest = this.game.id_guest.substring(0, this.game.id_guest.indexOf('@')) + ".png";
			let storageRefHost = this.firebaseApp.storage().ref().child('escudos/' + host);
			storageRefHost.getDownloadURL().then(url => {
				this.hostBadgeUrl = url;
				this.events.publish('hostImg:getted');
			});
			let storageRefGuest = this.firebaseApp.storage().ref().child('escudos/' + guest);
			storageRefGuest.getDownloadURL().then(url => {
				this.guestBadgeUrl = url;
				this.events.publish('guestImg:getted');
			});
			loader.dismiss();
		});
	}

	updateHostUrl($event) {
		this.events.subscribe('hostImg:getted', () => {
			$event.target.src = this.hostBadgeUrl;
		});
	}
	updateGuestUrl($event) {
		this.events.subscribe('guestImg:getted', () => {
			$event.target.src = this.guestBadgeUrl;
		});
	}

	goToMap() {
		this.navCtrl.push(MapPage, this.game.id_location);
	}

	goToDirections() {
		this.lPFutbolService.getLocation(this.game.id_location).subscribe(res => {
			let location = res;
			window.location = `geo:${location.lati},${location.long};u=35;`;
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
