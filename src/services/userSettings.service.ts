import { Injectable, NgZone } from '@angular/core';
import { Http/*, Response*/ } from '@angular/http';
import firebase from 'firebase';
import { AngularFire, AngularFireAuth } from "angularfire2";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook, TwitterConnect } from 'ionic-native';
import { GooglePlus } from '@ionic-native/google-plus';
import { LPFutbolService } from '../services/lp-futbol.service';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs';

@Injectable()

export class UserSettings {
	login: any;
	userProfile: any = null;
	error: any;
	zone: NgZone;
	favoriteTeams = [];

	favoriteLeagues = [];

	constructor(
		private http: Http,
		private events: Events,
		private af: AngularFire,
		private auth: AngularFireAuth,
		private storage: Storage,
		private lPFutbolService: LPFutbolService) { }

	addFavoriteTeam(team) {
		this.storage.set(team.id_team, JSON.stringify(team)).then(() => this.events.publish('favorites:changed'));
	}
	addFavoriteLeague(league) {
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


	logIn(email, password): boolean{
		let boolean = false;
		this.af.auth.login({ email: email.value, password: password.value })
			.then(success => {
				this.userProfile = success;
				boolean = true;
			})
			.catch((error) => {
				console.log("Firebase failure: " + JSON.stringify(error))
			});
			return boolean;
	}

	loginWithGoogle(): boolean{
		let boolean = false;
		GooglePlus.login({
			'webClientId': "679651523148-i663pj9qdb53c8a94qlu6inbnnp4542j.apps.googleusercontent.com",
			'offline': true
		}).then(res => {
			firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
				.then(success => {
					this.userProfile = success;
					this.lPFutbolService.writeUser(this.userProfile.uid, this.userProfile.email);
					boolean = true;
				})
				.catch(error => {
					console.log("Firebase failure: " + JSON.stringify(error));
					this.error = error;
				});
		}).catch(err => {
			console.error("Error: ", err)
			this.error = err;
		});
		return boolean;
	}

	loginWithFacebook(): boolean{
		let boolean = false;
		Facebook.login(['email']).then((response) => {
			const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
			firebase.auth().signInWithCredential(facebookCredential)
				.then((success) => {
					console.log("Firebase success: " + JSON.stringify(success));
					this.userProfile = success;
					this.lPFutbolService.writeUser(this.userProfile.uid, this.userProfile.email);
					boolean = true;
				})
				.catch((error) => {
					console.log("Firebase failure: " + JSON.stringify(error));
				});

		}).catch((error) => { console.log(error) });
		return boolean;
	}

	loginWithTwitter(): boolean{
		let boolean = false;
		TwitterConnect.login().then(response => {
			const twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);

			firebase.auth().signInWithCredential(twitterCredential)
				.then((success) => {
					console.log("Firebase success: " + JSON.stringify(success));
					this.userProfile = success;
					this.lPFutbolService.writeUser(this.userProfile.uid, this.userProfile.email);
					boolean = true;
				})
				.catch((error) => {
					console.log("Firebase failure: " + JSON.stringify(error));
				});
		}, error => {
			console.log("Error connecting to twitter: ", error);
		});
		return boolean;
	}

	getLoggedUser(){
		return this.userProfile;
	}

}