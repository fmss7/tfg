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
		return this.http.get(this.baseUrl + '/categories.json')
			.map(res => res.json());
	}

	getAllClubs(): Observable<any> {
		return this.http.get(this.baseUrl + '/clubs.json')
			.map(res => res.json());
	}

	getLeagueData(id_league): Observable<any> {
		return this.http.get(this.baseUrl + '/leagues-data/' + id_league + '.json')
			.map(res => {
				this.currentLeague = res.json();
				this.currentLeagueId = id_league;
				return this.currentLeague;
			});
	};

	getLocation(id_location) {
		return this.http.get(this.baseUrl + '/locations/' + id_location + '.json')
			.map(res => res.json());
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

}

