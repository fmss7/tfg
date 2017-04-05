import { Injectable } from '@angular/core';
import { Http/*, Response*/ } from '@angular/http';
import { AngularFire } from "angularfire2";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs';

@Injectable()

export class UserSettings {

	favoriteTeams = [];

	favoriteLeagues = [];

	constructor(
		private http: Http,
		private events: Events,
		private af: AngularFire,
		private storage: Storage) { }

	favoriteTeam(team) {
		this.storage.set(team.id_team, JSON.stringify(team)).then(() => this.events.publish('favorites:changed'));
	}
	favoriteLeague(league) {
		this.storage.set(league.id_league, JSON.stringify(league)).then(() => this.events.publish('favorites:changed'));
	}


	unFavoriteTeam(id_team) {
		this.storage.remove(id_team).then(() => this.events.publish('favorites:changed'));
	}
	unFavoriteLeague(id_league) {
		this.storage.remove(id_league).then(() => this.events.publish('favorites:changed'));
	}

	isFavourite(id) {
		return this.storage.get(id).then(value => value ? true : false);
	}

	getFavoriteTeams() {
		let item = [];
		this.storage.forEach((value, key) => {
			if (key.indexOf('@') != -1) {
				item.push(JSON.parse(value));
			}
		});
		return item;
	}

	getFavoriteLeagues() {
		let item = [];
		this.storage.forEach((value, key) => {
			if (key.indexOf('@') == -1) {
				item.push(JSON.parse(value));
			}
			
		});
		return item;
	}

}