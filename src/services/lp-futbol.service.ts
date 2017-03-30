import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import { AngularFire } from "angularfire2";

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol-cfeff.firebaseio.com/";
	currentLeague: any = {};

	constructor(private http: Http, private af: AngularFire) { }

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
				return this.currentLeague;
			});
	};

	getLocation(id_location) {
		return this.http.get(this.baseUrl + '/locations/' + id_location + '.json')
			.map(res => res.json());
	}

	getCurrentLeague(){
		return this.currentLeague;
	}

}

