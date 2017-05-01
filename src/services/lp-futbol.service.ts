import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import { AngularFire } from "angularfire2";
import * as _ from 'lodash';

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol-cfeff.firebaseio.com";
	currentLeague: any = {};
	currentLeagueId: string;

	constructor(private http: Http, private af: AngularFire, public events: Events) {
	}

	getAllCategories(): Observable<any> {
		return this.af.database.list(this.baseUrl + '/categories');
	}

	getAllClubs(): Observable<any> {
		return this.af.database.list(this.baseUrl + '/clubs');
	}

	getLeagueData(id_league): Observable<any> {
		return this.af.database.list(this.baseUrl + '/leagues-data/' + id_league)
			.map(res => {
				this.currentLeague = {
					"category": res[0].$value,
					"games": res[1],
					"name": res[2].$value,
					"teams": res[3]
				}
				this.currentLeagueId = id_league;
				return this.currentLeague;
			});
	};

	getLocation(id_location): Observable<any> {
		return this.af.database.list(this.baseUrl + '/locations/' + id_location)
			.map(res => {
				return {
					"address": res[0].$value,
					"lati": res[1].$value,
					"long": res[2].$value,
					"name": res[3].$value,
					"place": res[4].$value
				};
			});
	}

	getCurrentLeague() {
		return this.currentLeague;
	}

	updateGameScore(game) {
		let index: number;
		index = _.findIndex(this.currentLeague.games, g => {
			return g.id_game == game.id_game;
		});
		delete game.goalsDisplay;
		delete game.opponent;
		this.af.database.list('/leagues-data/' + this.currentLeagueId + "/games").update(index.toString(), game);
	}

	createUser(email, password): any {
		let boolean = false;
		this.af.auth.createUser({ email: email, password: password })
			.then(
			(success) => {
				let newUser = {
					"uid": success.uid,
					"email": email,
					"role-value": 2
				};
				this.af.database.object(`/users/${success.uid}`);
				this.af.database.list('/users/').update(success.uid, newUser);
				boolean = true;
			}).catch(
			(err) => {
				console.log(err);
			});
		return boolean;
	}

	writeUser(uid, email) {
		this.af.database.object(`users/${uid}`)
			.subscribe(data => {
				if (data.$value == null) {
					let user = {
						"uid": uid,
						"email": email,
						"role-value": 2
					}
					this.af.database.object('/users/' + user.uid);
					this.af.database.list('/users/').update(user.uid, user);
				}
			});
	}

}

