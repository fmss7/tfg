import { Injectable } from '@angular/core';
import { Http/*, Response*/ } from '@angular/http';
import { AngularFire } from "angularfire2";
//import { Observable } from 'rxjs/Observable';
//import 'rxjs';

@Injectable()

export class UserSettings {

	favoriteTeams = [
		{
			"name": "CLARET, A.D.",
			"category": "Regional",
			"label": "A",
			"league": "2ª Regional",
			"leagueId": "reg-seg",
			"pitch": {
				"name": "Colegio Claret",
				"address": "Calle Cruz del Ovejero, 115",
				"place": "Colegio Chivato Claret",
				"lati": 28.099270,
				"long": -15.482702
			}
		},

	];

	favoriteLeagues = [
		{
			"name": "División de Honor",
			"category": "Juvenil",
			"teams": []
		}

	];

	constructor(private http: Http, private af: AngularFire) { }

	getFavoriteTeams() {
		return this.favoriteTeams;
	}

	getFavoriteLeagues() {
		return this.favoriteLeagues;
	}

}