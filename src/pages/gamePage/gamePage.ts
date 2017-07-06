import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { MapPage, TeamHomePage } from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { UserSettings } from '../../services/userSettings.service';

declare var window: any;

@Component({
	selector: 'gamePage',
	templateUrl: 'gamePage.html'
})
export class GamePage {

	game: any;
	storage: any;
	startedGame: boolean;
	badgesUrl: string = 'gs://lp-futbol-cfeff.appspot.com/escudos/';
	hostBadgeUrl: string;
	guestBadgeUrl: string;
	urls: number = 0;
	user: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private loadingController: LoadingController,
		private userSettings: UserSettings,
		private lPFutbolService: LPFutbolService,
		@Inject(FirebaseApp) private firebaseApp: any) {
		this.game = this.navParams.data;
	}

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			spinner: 'bubbles',
			cssClass: 'loadingController'
		});
		loader.present().then(() => {
			this.game.hostGoals >= 0 || this.game.guestGoals >= 0 ? this.startedGame = true : this.startedGame = false;
			let host = this.game.id_host.substring(0, this.game.id_host.indexOf('@')) + ".png";
			let guest = this.game.id_guest.substring(0, this.game.id_guest.indexOf('@')) + ".png";
			let storageRefHost = this.firebaseApp.storage().ref().child('escudos/' + host);
			this.hostBadgeUrl = `/assets/escudos/${host}`;
			this.guestBadgeUrl = `/assets/escudos/${guest}`;
			
			storageRefHost.getDownloadURL().then(url => {
				this.hostBadgeUrl = url;
				this.events.publish('hostImg:getted');
			});
			
			let storageRefGuest = this.firebaseApp.storage().ref().child('escudos/' + guest);
			storageRefGuest.getDownloadURL().then(url => {
				this.guestBadgeUrl = url;
				this.events.publish('guestImg:getted');
			});
			
			this.userSettings.getLoggedUser();
			this.events.subscribe("user::getted", user => {
				this.user = user;
			});

			loader.dismiss();
			this.events.subscribe('loader::dismiss', () => loader.dismiss());
		});
	}

	
		updateHostUrl($event) {
			this.events.subscribe('hostImg:getted', () => {
				$event.target.src = this.hostBadgeUrl;
				this.urls++;
				if (this.urls == 2) {
					this.events.publish('loader::dismiss');
				}
			});
		}
		updateGuestUrl($event) {
			this.events.subscribe('guestImg:getted', () => {
				$event.target.src = this.guestBadgeUrl;
			});
			this.urls++;
			if (this.urls == 2) {
				this.events.publish('loader:dismiss');
			}
		}
	

	startGame(){
		this.game.hostGoals = 0;
		this.game.guestGoals = 0;
		this.lPFutbolService.updateGameScore(this.game);
		this.events.subscribe("game::updated", () => {
			this.startedGame = true;
		});
	}

	addHostGoal() {
		this.game.hostGoals += 1;
		this.lPFutbolService.updateGameScore(this.game);
	}
	addGuestGoal() {
		this.game.guestGoals += 1;
		this.lPFutbolService.updateGameScore(this.game);
	}
	removeHostGoal() {
		if (this.game.hostGoals > 0) {
			this.game.hostGoals -= 1;
			this.lPFutbolService.updateGameScore(this.game);
		}
	}
	removeGuestGoal() {
		if (this.game.guestGoals > 0) {
			this.game.guestGoals -= 1;
			this.lPFutbolService.updateGameScore(this.game);
		}
	}

	teamTapped(id_team) {
		let league = this.lPFutbolService.getCurrentLeague();
		let team = league.teams.find(t => t.id_team === id_team);
		this.navCtrl.push(TeamHomePage, team);
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
