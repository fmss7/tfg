import { Injectable, NgZone } from '@angular/core';
import { Http/*, Response*/ } from '@angular/http';
import firebase from 'firebase';
import { AngularFire, AngularFireAuth } from "angularfire2";
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook, TwitterConnect } from 'ionic-native';
import { GooglePlus } from '@ionic-native/google-plus';
import { LPFutbolService } from '../services/lp-futbol.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
//import 'rxjs';

@Injectable()

export class UserSettings {
	login: any;
	userProfile: any = {};
	error: any;
	zone: NgZone;
	favoriteTeams = [];
	baseUrl: string = "https://lp-futbol-cfeff.firebaseio.com";

	favoriteLeagues = [];

	constructor(
		private http: Http,
		private events: Events,
		private af: AngularFire,
		private auth: AngularFireAuth,
		private storage: Storage,
		private lPFutbolService: LPFutbolService) { }

	addFavoriteTeam(team) {
		this.storage.get("user").then(user => {
			if (user) {
				this.af.database.object(`/users/${user.uid}/favoriteTeams/${team.id_team}`);
				this.af.database.list(`/users/${user.uid}/favoriteTeams`).update(team.id_team, team)
					.then(() => {
						this.getUserFromFB(user.uid);
					});
			}
		});
		this.storage.set(team.id_team, JSON.stringify(team)).then(() => this.events.publish('favorites:changed'));
	}

	addFavoriteLeague(league) {
		this.storage.get("user").then(user => {
			if (user) {
				this.af.database.object(`/users/${user.uid}/favoriteLeagues/${league.id_league}`);
				this.af.database.list(`/users/${user.uid}/favoriteLeagues`).update(league.id_league, league)
					.then(() => {
						this.getUserFromFB(user.uid);
					});
			}
		});
		this.storage.set(league.id_league, JSON.stringify(league)).then(() => this.events.publish('favorites:changed'));
	}

	unFavoriteTeam(id_team) {
		this.storage.get("user").then(user => {
			if (user) {
				this.af.database.list(`/users/${user.uid}/favoriteTeams`).remove(id_team)
					.then(() => {
						this.getUserFromFB(user.uid);
					});
			}
		});
		this.storage.remove(id_team).then(() => this.events.publish('favorites:changed'));
	}
	unFavoriteLeague(id_league) {
		this.storage.get("user").then(user => {
			if (user) {
				this.af.database.list(`/users/${user.uid}/favoriteLeagues`).remove(id_league)
					.then(() => {
						this.getUserFromFB(user.uid);
					});
			}
		});
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
			if (key.indexOf('@') == -1 && key != "user") {
				item.push(JSON.parse(value));
			}

		});
		return item;
	}

	createUser(email, password): any {
		let boolean = false;
		this.af.auth.createUser({ email: email, password: password })
			.then(
			(success) => {
				boolean = true;
				this.writeUser(success.uid, email);
				this.events.publish("user::created", boolean);
			}).catch(
			(err) => {
				console.log(err);
				this.events.publish("user::created", boolean);
			});
	}

	logIn(email, password) {
		let boolean = false;
		this.af.auth.login({ email: email.value, password: password.value })
			.then(success => {
				boolean = true;
				this.getUserFromFB(success.uid).subscribe(() => {
					this.events.publish("logIn::done", boolean);
				});

			})
			.catch((error) => {
				console.log("Firebase failure: " + error);
				this.events.publish("logIn::done", boolean);
			});
	}

	logOut() {
		let boolean = false;
		this.af.auth.logout()
			.then(success => {
				boolean = true;
				this.storage.remove("user").then(() => {
					this.events.publish('user:changed');
					this.events.publish("logOut::done", boolean)
				});
			})
			.catch((error) => {
				console.log("Firebase failure: " + error);
				this.events.publish("logOut::done", boolean);
			});
	}

	loginWithGoogle() {
		let boolean = false;
		GooglePlus.login({
			'webClientId': "679651523148-i663pj9qdb53c8a94qlu6inbnnp4542j.apps.googleusercontent.com",
			'offline': true
		}).then(res => {
			firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
				.then(success => {
					boolean = true;
					this.writeUser(success.uid, success.email).then(() => {
						this.getUserFromFB(success.uid);
					});
					this.events.publish("loginWithGoogle::done", boolean);
				})
				.catch(error => {
					console.log("Firebase failure: " + JSON.stringify(error));
					this.error = error;
					this.events.publish("loginWithGoogle::done", boolean);
				});
		}).catch(err => {
			console.error("Error: ", err)
			this.error = err;
			this.events.publish("loginWithGoogle::done", boolean);
		});
	}

	loginWithFacebook() {
		let boolean = false;
		Facebook.login(['email']).then((response) => {
			const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
			firebase.auth().signInWithCredential(facebookCredential)
				.then((success) => {
					boolean = true;
					this.writeUser(success.uid, success.email).then(() => {
						this.getUserFromFB(success.uid);
					});
					this.events.publish("loginWithFacebook::done", boolean);
				})
				.catch((error) => {
					console.log("Firebase failure: " + JSON.stringify(error));
					this.events.publish("loginWithFacebook::done", boolean);
				});

		}).catch((error) => {
			console.log(error);
			this.events.publish("loginWithFacebook::done", boolean);
		});
	}

	loginWithTwitter() {
		let boolean = false;
		TwitterConnect.login().then(response => {
			const twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);
			firebase.auth().signInWithCredential(twitterCredential)
				.then((success) => {
					boolean = true;
					this.writeUser(success.uid, success.email).then(() => {
						this.getUserFromFB(success.uid);
					});
					this.events.publish("loginWithTwitter::done", boolean);
				})
				.catch((error) => {
					this.events.publish("loginWithTwitter::done", boolean);
				});
		}, error => {
			this.events.publish("loginWithTwitter::done", boolean);
		});
	}

	writeUser(uid, email): any {
		this.af.database.object(`users/${uid}`)
			.subscribe(data => {
				if (data.$value == null) {
					let user = {
						"uid": uid,
						"email": email,
						"roleValue": 2,
						"favoriteTeams": [0],
						"favoriteLeagues": [0]
					}
					this.af.database.object(`/users/${user.uid}`);
					this.af.database.list('/users/').update(user.uid, user);
				}
			});
	}

	getUserFromFB(uid): Observable<any> {
		return this.af.database.list(`${this.baseUrl}/users/${uid}`)
			.map(user => {
				this.userProfile = {
					"email": user[0].$value,
					"favoriteLeagues": user[1],
					"favoriteTeams": user[2],
					"roleValue": user[3].$value,
					"uid": user[4].$value
				}
				this.storage.set("user", this.userProfile).then(() => {
					this.events.publish('user:changed');
				});
				return this.userProfile;
			});
	}

	getLoggedUser() {
		this.storage.get("user").then(user => {
			this.events.publish("user::getted", user);
		});
	}

}