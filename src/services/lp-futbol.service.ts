import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';

@Injectable()

export class LPFutbolService {

	baseUrl: string = "https://lp-futbol.firebaseio.com/";

	constructor(private http: Http) { }

	getAllTeams() {
		return new Promise(resolve => {
			this.http.get(`${this.baseUrl}/teams.json`)
				.subscribe(res => resolve(res.json()));
		});
	}

}