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
				"long": 28.153196,
				"lati": -15.415526
			}
		}
	];

	constructor(private http: Http) { }

	getFavoriteTeams() {
		return this.favoriteTeams;
	}

}