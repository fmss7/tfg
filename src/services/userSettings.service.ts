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

	favoriteLeagues = [
		{
			"id_league": "reg-pref",
			"name": "Regional Preferente"
		}

	];

	constructor(
		private http: Http,
		private events: Events,
		private af: AngularFire,
		private storage: Storage) { }

	favoriteTeam(team) {
		this.storage.set(team.id, JSON.stringify(team)).then(() => this.events.publish('favorites:changed'));
	}

	unFavoriteTeam(team) {
		this.storage.remove(team.id).then(() => this.events.publish('favorites:changed'));
	}

    isFavouriteTeam(teamId){
        return this.storage.get(teamId).then(value => value ? true : false);
    }

	getFavoriteTeams() {
		let item = [];
		this.storage.forEach((value, key) => {
			item.push(JSON.parse(value))
		});
		return item;
	}

	getFavoriteLeagues() {
		return this.favoriteLeagues;
	}

}