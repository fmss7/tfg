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

	updateGameScore(game){
		let index: number;
		index = _.findIndex(this.currentLeague.games, g => {
			return g.id_game == game.id_game;
		});
		delete game.goalsDisplay;
		delete game.opponent;
		this.af.database.list(this.baseUrl + `/leagues-data/${this.currentLeagueId}/games`).update(index.toString(), game)
		.then(() => {
			this.events.publish("game::updated");
		});
	}

	editClub(club){
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

