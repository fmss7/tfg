import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import { AngularFire } from "angularfire2";
import * as _ from 'lodash';
import { Push, PushToken } from '@ionic/cloud-angular';

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol-cfeff.firebaseio.com";
	currentLeague: any = {};
	currentLeagueId: string;

	constructor(private http: Http, private af: AngularFire, public events: Events, public push: Push) {
	}

	getAllCategories(): Observable<any> {
		return this.af.database.list(this.baseUrl + '/categories');
	}

	getAllClubs(): Observable<any> {
		return this.af.database.list(`${this.baseUrl}/clubs`);
	}

	getLeagueData(id_league): Observable<any> {
		return this.af.database.list(`${this.baseUrl}/leagues-data/${id_league}`)
			.map(res => {
				_.forEach(res, value => {
					value.$value ? this.currentLeague[value.$key] = value.$value : this.currentLeague[value.$key] = value;
				});
				this.currentLeagueId = id_league;
				return this.currentLeague;
			});
	};

	getLocation(id_location): Observable<any> {
		return this.af.database.list(`${this.baseUrl}/locations/${id_location}`)
			.map(res => {
				let location = {};
				_.forEach(res, value => {
					value.$value ? location[value.$key] = value.$value : location[value.$key] = value;
				});
				return location;
			});
	}

	getCurrentLeague() {
		return this.currentLeague;
	}

	updateGameScore(game) {
		let index: number;
		let usersTokens = [];
		let teamKey;
		let teamCat = game.id_host.substring(game.id_host.indexOf('@') + 1);
		switch (teamCat) {
			case "reg-pref":
				teamKey = "0";
				break;
			case "juv-ddh":
				teamKey = "1";
				break;
			case "juv-pref":
				teamKey = "2";
				break;
			case "cad-pref":
				teamKey = "3";
				break;
			case "cad-priG1":
				teamKey = "4";
				break;
			case "cad-priG2":
				teamKey = "5";
				break;
			case "inf-prefG1":
				teamKey = "6";
				break;
			case "inf-prefG2":
				teamKey = "7";
				break;
			case "ale-prefG1":
				teamKey = "8";
				break;
			case "ale-prefG2":
				teamKey = "9";
				break;
			default:
				break;
		}
		this.af.database.list(`${this.baseUrl}/clubs/${game.id_hostClub}/teams/${teamKey}/followers`)
			.subscribe(followers => {
				_.forEach(followers, (value, key) => {
					usersTokens.push(value.token);
				});
				let id_guestClub = game.id_guest.substring(0, game.id_guest.indexOf('@'));
				this.af.database.list(`${this.baseUrl}/clubs/${id_guestClub}/teams/${teamKey}/followers`)
					.subscribe(followers => {
						_.forEach(followers, (value, key) => {
							usersTokens.push(value.token);
						});
					});
			});

		index = _.findIndex(this.currentLeague.games, g => {
			return g.id_game == game.id_game;
		});
		delete game.goalsDisplay;
		delete game.opponent;
		this.af.database.list(this.baseUrl + `/leagues-data/${this.currentLeagueId}/games`).update(index.toString(), game)
			.then(() => {
				_.forEach(usersTokens, token => {
					let url = 'https://fcm.googleapis.com/fcm/send';
					let body = {
						"title": "LP Futbol",
						"notification": {
							"title": game.host + " " + game.hostGoals + "-" + game.guestGoals + " " + game.guest,
						},
						"to": token
					};

					let headers: Headers = new Headers({
						'Content-Type': 'application/json',
						'Authorization': 'key=' + 'AIzaSyAyKhPoK-36WhhKT3p0IxeMFZftDNIvTP8'
					});
					let options = new RequestOptions({ headers: headers });
					this.http.post(url, body, options).map(response => {
						return response;
					}).subscribe(data => {
					});
				});

				this.events.publish("game::updated");
			});
	}

	editClub(club) {
		this.af.database.list(this.baseUrl + `/clubs/`).update(club.$key, club);
	}

	obtenerTodasLasLigas(): Observable<any> {
		console.log("moc? ");
		return this.af.database.list(`${this.baseUrl}/leagues-data`);
	}
	escribirTodasLasLigas(ligas) {
		console.log("moc? ", ligas);
		return this.af.database.list(`${this.baseUrl}`).update("leagues-data", ligas);
	}

}

