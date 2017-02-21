import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';

@Injectable()

export class UserSettings {

	favoriteTeams = [
		{
			"name": "A.D. Claret",
			"category": "Regional",
			"label": "A",
			"league": "2ª Regional",
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
			"name": "Juvenil División de Honor",
			"category": "Juvenil",
			"teams": []
		}

	];

	constructor(private http: Http) { }

	getFavoriteTeams() {
		return this.favoriteTeams;
	}

	getFavoriteLeagues(){
		return this.favoriteLeagues;
	}

}