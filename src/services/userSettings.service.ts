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
import { Md5 } from 'ts-md5/dist/md5';
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
				let teamKey;
				let teamCat = team.id_team.substring(team.id_team.indexOf('@') + 1);
				switch (teamCat) {
					case "reg-pref":
						teamKey = "0";
						break;
					case "juv-ddh":
						teamKey = "1";
						break;
					case "juv-pref":
						teamKey = "2";
						break;
					case "cad-pref":
						teamKey = "3";
						break;
					case "cad-priG1":
						teamKey = "4";
						break;
					case "cad-priG2":
						teamKey = "5";
						break;
					case "inf-prefG1":
						teamKey = "6";
						break;
					case "inf-prefG2":
						teamKey = "7";
						break;
					case "ale-prefG1":
						teamKey = "8";
						break;
					case "ale-prefG2":
						teamKey = "9";
						break;
					default:
						break;
				}
				let id_club = team.id_team.substring(0, team.id_team.indexOf('@'));
				this.af.database.object(`/clubs/${id_club}/teams/${teamKey}/followers/${user.uid}`);
				this.af.database.list(`/clubs/${id_club}/teams/${teamKey}/followers`).update(user.uid, user);
				this.af.database.object(`/users/${user.uid}/favoriteTeams/${team.id_team}`);
				this.af.database.list(`/users/${user.uid}/favoriteTeams`).update(team.id_team, team)
					.then(() => {
						this.getUserFromFB(user.uid, user.password);
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
						this.getUserFromFB(user.uid, user.password);
					});
			}
		});
		this.storage.set(league.id_league, JSON.stringify(league)).then(() => this.events.publish('favorites:changed'));
	}

	unFavoriteTeam(id_team) {
		this.storage.get("user").then(user => {
			if (user) {
				let teamKey;
				let teamCat = id_team.substring(id_team.indexOf('@') + 1);
				switch (teamCat) {
					case "reg-pref":
						teamKey = "0";
						break;
					case "juv-ddh":
						teamKey = "1";
						break;
					case "juv-pref":
						teamKey = "2";
						break;
					case "cad-pref":
						teamKey = "3";
						break;
					case "cad-priG1":
						teamKey = "4";
						break;
					case "cad-priG2":
						teamKey = "5";
						break;
					case "inf-prefG1":
						teamKey = "6";
						break;
					case "inf-prefG2":
						teamKey = "7";
						break;
					case "ale-prefG1":
						teamKey = "8";
						break;
					case "ale-prefG2":
						teamKey = "9";
						break;
					default:
						break;
				}
				let id_club = id_team.substring(0, id_team.indexOf('@'));
				this.af.database.list(`/clubs/${id_club}/teams/${teamKey}/followers`).remove(user.uid);
				this.af.database.list(`/users/${user.uid}/favoriteTeams`).remove(id_team)
					.then(() => {
						this.getUserFromFB(user.uid, user.password);
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
						this.getUserFromFB(user.uid, user.password);
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
			this.events.publish("storageTeams::getted", item);
		});

		this.events.subscribe("storageTeams::getted", item => {
			if (item.length == 0) {
				this.storage.get("user").then(user => {
					if (user) {
						this.af.database.list(`/users/${user.uid}/favoriteTeams`)
							.subscribe(favoriteTeams => {
								item = [];
								_.forIn(favoriteTeams, (value, key) => {
									if (value.$value != 0) {
										item.push(value);
										this.storage.set(value.id_team, JSON.stringify(value));
									}
								});
								this.events.publish("favoriteTeams:getted", item);
							});
					}
				});
			} else {
				this.events.publish("favoriteTeams:getted", item);
			}
		});

	}

	getFavoriteLeagues() {
		let item = [];
		this.storage.forEach((value, key) => {
			if (key.indexOf('@') == -1 && key != "user") {
				item.push(JSON.parse(value));
			}
			this.events.publish("storageLeagues::getted", item);
		});

		this.events.subscribe("storageLeagues::getted", item => {
			if (item.length == 0) {
				this.storage.get("user").then(user => {
					if (user) {
						this.af.database.list(`/users/${user.uid}/favoriteLeagues`)
							.subscribe(favoriteLeagues => {
								item = [];
								_.forIn(favoriteLeagues, (value, key) => {
									if (value.$value != 0) {
										item.push(value);
										this.storage.set(value.id_league, JSON.stringify(value));
									}
								});
								this.events.publish("favoriteLeagues:getted", item);
							});
					}
				});
			} else {
				this.events.publish("favoriteLeagues:getted", item);
			}
		});
	}

	createUser(email, password) {
		let boolean = false;
		this.af.auth.createUser({ email: email, password: password })
			.then(
			(success) => {
				boolean = true;
				this.writeUser(success.uid, email).then(writen => {
					if (writen) {
						this.events.publish("user::created", boolean);
					}
				});

			}).catch(
			(err) => {
				console.log(err);
				this.events.publish("user::created", boolean);
			});
	}

	logIn(email, password) {
		let boolean = false;
		this.af.auth.login({ email: email, password: password })
			.then(success => {
				boolean = true;
				this.getUserFromFB(success.uid, password).subscribe(() => {
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
		let user = {
			"uid": uid,
			"email": email,
			"roleValue": 2,
			"id_club": ""
		}
		this.af.database.object(`users/${uid}`);
		this.af.database.list('/users').update(uid, user).then(() => {
			return true;
		});

	}

	getUserFromFB(uid, password?): Observable<any> {
		return this.af.database.list(`${this.baseUrl}/users/${uid}`)
			.map(user => {
				_.forEach(user, value => {
					value.$value ? this.userProfile[value.$key] = value.$value : this.userProfile[value.$key] = value;
				});
				this.userProfile["password"] = Md5.hashStr(password);
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

	updateEmail(newEmail) {
		let boolean = false;
		this.af.auth.getAuth().auth.updateEmail(newEmail)
			.then(() => {
				boolean = true;
				let email = {
					"email": newEmail
				}
				this.af.database.list(`/users`).update(this.af.auth.getAuth().uid, email).then(() => {
					this.events.publish("userEmail::updated", boolean);
				});

			})
			.catch(e => {
				console.error(e);
				this.events.publish("userEmail::updated", boolean);
			});
	}

	updatePassword(newPassword) {
		this.af.auth.getAuth().auth.updatePassword(newPassword).then(() => {
			this.storage.get("user").then(user => {
				this.userProfile = user;
				this.userProfile["password"] = Md5.hashStr(newPassword);
				this.storage.set("user", this.userProfile).then(() => {
					this.events.publish('user:changed');
					this.events.publish("password::updated", true);
				});
			})
		});
	}

}