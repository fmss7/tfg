import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import { AngularFire } from "angularfire2";

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol-cfeff.firebaseio.com/";

	constructor(private http: Http, private af: AngularFire) { }

	getAllTeams(): Observable<any> {
		return this.http.get(this.baseUrl + '/teams.json')
			.map(res => res.json());
	}

	getAllLeagues(): Observable<any> {
		return this.http.get(this.baseUrl + '/leagues.json')
			.map(res => res.json());
	}

	getAllCategories(): Observable<any> {
		return this.http.get(this.baseUrl + '/categories.json')
			.map(res => res.json());
	}
	getAllClubs(): Observable<any> {
		return this.http.get(this.baseUrl + '/clubs.json')
			.map(res => res.json());
	}
	/*
		getCategoryData(categoryID): Observable<any> {
			return this.http.get(this.baseUrl+'/categories-data/'+categoryID+'.json')
				.map(res => res.json());
		}
	*/
	getLeagueData(leagueId): Observable<any> {
		return this.http.get(this.baseUrl + '/leagues-data/' + leagueId + '.json')
			.map(res => res.json());
	};

}

