import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol.firebaseio.com";

	constructor(private http: Http) { }

	getAllTeams(): Observable<any> {
		return this.http.get(this.baseUrl+'/teams.json')
			.map(res => res.json());
	}

	getAllLeagues(): Observable<any> {
		return this.http.get(this.baseUrl+'/leagues.json')
			.map(res => res.json());
	}

	getAllCategories(): Observable<any> {
		return this.http.get(this.baseUrl+'/categories.json')
			.map(res => res.json());
	}
/*
	getCategoryData(categoryID): Observable<any> {
		return this.http.get(this.baseUrl+'/categories-data/'+categoryID+'.json')
			.map(res => res.json());
	}
*/
	getLeagueData(leagueId): Observable<any> {
		return this.http.get(this.baseUrl+'/leagues-data/'+leagueId+'/teams.json')
			.map(res => res.json());
	};

}

