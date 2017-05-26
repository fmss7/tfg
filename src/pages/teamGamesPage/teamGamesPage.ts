import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Events, Content } from 'ionic-angular';
import { GamePage } from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';
import { UserSettings } from '../../services/userSettings.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'teamGamesPage',
	templateUrl: 'teamGamesPage.html'
})
export class TeamGamesPage {
	@ViewChild(Content) content: Content;
	team: any;
	teamPos: number;
	games: any;
	allGames: any;
	scrollIndex: string;
	isFollowing: boolean = false;
	dateFilter: string;
	useDateFilter = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		private lPFutbolService: LPFutbolService,
		private userSettings: UserSettings,
		private alertController: AlertController,
		private toastController: ToastController) {
		this.team = this.navParams.data;
	}

	ionViewDidLoad() {
		this.events.subscribe('league(Team):getted', league => {
			this.userSettings.isFavourite(this.team.id_team).then(value => this.isFollowing = value);
			this.games = _.chain(league.games)
				.filter(g => g.host == this.team.name || g.guest == this.team.name)
				.map(g => {
					let isTeam1 = (g.host === this.team.name);
					let opponentName = isTeam1 ? g.guest : g.host;
					let goalsDisplay = this.getGoalsDisplay(isTeam1, g.hostGoals, g.guestGoals);
					return {
						id_game: g.id_game,
						fixture: g.fixture,
						id_hostClub: g.id_hostClub,
						id_host: g.id_host,
						host: g.host,
						hostGoals: g.hostGoals,
						guestGoals: g.guestGoals,
						guest: g.guest,
						id_guest: g.id_guest,
						opponent: opponentName,
						date: g.date,
						time: g.time,
						pitch: g.pitch,
						id_location: g.id_location,
						goalsDisplay: goalsDisplay,
					}
				})
				.value();
			this.events.subscribe('position:getted', pos => { this.teamPos = pos + 1 });
			this.allGames = this.games;
			let i = -4;
			_.forEach(this.allGames, game => {
				if (game.hostGoals >= 0 && game.guestGoals >= 0) {
					i++;
				} else {
					return false;
				}
			});
			this.scrollIndex = i.toString();

		});
	}

	ngAfterViewChecked() {
		if (document.getElementById(this.scrollIndex)) {
			let verticalOffset = document.getElementById(this.scrollIndex).offsetTop;
			//this.content.scrollTo(0, verticalOffset);
		}
	}

	toggleFollow() {
		if (this.isFollowing) {
			let confirm = this.alertController.create({
				title: this.team.name,
				message: '¿Quieres dejar de seguir a este equipo?',
				buttons: [
					{
						text: 'Si',
						handler: () => {
							this.isFollowing = false;
							this.userSettings.unFavoriteTeam(this.team.id_team);
							let toast = this.toastController.create({
								message: 'Has dejado de seguir a este equipo',
								duration: 1250,
								position: 'bottom'
							});
							toast.present();
						}
					},
					{ text: 'No' }
				]
			});
			confirm.present();
		} else {
			this.isFollowing = true;
			this.userSettings.addFavoriteTeam(this.team);
			let toast = this.toastController.create({
				message: 'Has empezado a seguir a este equipo',
				duration: 1250,
				position: 'bottom'
			});
			toast.present();
		}
	}

	dateChange() {
		if (this.useDateFilter) {
			this.games = _.filter(this.allGames, g => g.date == moment(this.dateFilter).format('D/M/YYYY'));
		} else {
			this.games = this.allGames;
		}
	}

	getGoalsDisplay(isTeam1, hostGoals, guestGoals) {
		if (hostGoals >= 0 && guestGoals >= 0) {
			var teamGoals = (isTeam1 ? hostGoals : guestGoals)
			var opponentGoals = (isTeam1 ? guestGoals : hostGoals);
			var winIndicator;
			if (teamGoals > opponentGoals) {
				winIndicator = 'V';
			} else if (teamGoals < opponentGoals) {
				winIndicator = 'D';
			} else {
				winIndicator = 'E';
			}
			return winIndicator;
		} else {
			return '';
		}
	}

	getGoalsDisplayBadgeClass(game) {
		if (game.goalsDisplay.indexOf('V') === 0) {
			return 'secondary';
		} else if (game.goalsDisplay.indexOf('D') === 0) {
			return 'danger';
		} else {
			return 'warning';
		}
	}

	gameTapped($event, game) {
		this.navCtrl.parent.parent.push(GamePage, game);
	}

}