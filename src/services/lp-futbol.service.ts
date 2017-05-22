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
		this.af.database.list(this.baseUrl + `/leagues-data/${this.currentLeagueId}/games`).update(index.toString(), game);
	}

	obtenerTodasLasLigas(): Observable<any> {
		console.log("moc? ");
		return this.af.database.list(`${this.baseUrl}/leagues-data`);
	}
	escribirTodasLasLigas(ligas){
		console.log("moc? ", ligas);
		return this.af.database.list(`${this.baseUrl}`).update("leagues-data", ligas);
	}

}

