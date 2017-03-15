import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Facebook } from 'ionic-native';
import { GooglePlus } from '@ionic-native/google-plus';
import { Splashscreen } from '@ionic-native/splashscreen';
import { StatusBar } from '@ionic-native/statusbar';
import { ModalModule } from 'ng2-bootstrap/modal';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, AngularFireAuth, FirebaseAuthState } from "angularfire2";
import firebase from 'firebase';
import { HomePage, TeamHomePage, LeagueHomePage } from '../pages/pages';
import { UserSettings } from '../services/userSettings.service';

@Component({
	templateUrl: 'app.html', providers: [UserSettings, HttpModule]
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;

	favoriteTeams: any[];
	favoriteLeagues: any[];
	rootPage: any = HomePage;

	constructor(
		public platform: Platform,
		private userSettings: UserSettings,
		private loadingController: LoadingController,
		public modalCtrl: ModalController) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
		this.favoriteTeams = this.userSettings.getFavoriteTeams();
		this.favoriteLeagues = this.userSettings.getFavoriteLeagues();
	}

	teamTapped($event, fav) {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			dismissOnPageChange: true
		});
		loader.present();
		this.nav.push(TeamHomePage, fav);
	}

	leagueTapped($event, fav) {
		let loader = this.loadingController.create({
			content: 'Obteniendo datos...',
			dismissOnPageChange: true
		});
		loader.present();
		this.nav.push(LeagueHomePage, fav);
	}

	logInTapped() {
		let logInModal = this.modalCtrl.create(LogIn);
		logInModal.present();
	}
}

@Component({
	template: `
		<ion-header>
			<ion-navbar color="primary">
				<ion-title>Entra</ion-title>
				<ion-buttons end>
					<button ion-button (click)="closeModal()"><ion-icon name="close"></ion-icon></button>
				</ion-buttons>
			</ion-navbar>
		</ion-header>

		<ion-content padding>
			<p *ngIf="error">{{error}}</p>
			<ion-card *ngIf="userProfile">
				<ion-avatar item-left><img [src]="userProfile.photoURL"/></ion-avatar>
				<ion-card-content>
					<ion-card-title>{{ userProfile.displayName }}</ion-card-title>
					<p>The UID for this new user is {{userProfile.uid}} and the email is {{userProfile.email}}</p>
				</ion-card-content>
			</ion-card>

			<div class="login-box">
				<form #registerForm="ngForm">
					<ion-row>
						<ion-col>
							<ion-list inset>
								<ion-item>
									<ion-input type="email" placeholder="Usuario" name="userName" #email required></ion-input>
								</ion-item>
								<ion-item>
									<ion-input type="password" placeholder="Contraseña" name="userPassword" #password required></ion-input>
								</ion-item>
							</ion-list>
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col class="signup-col">
							<button color="secondary" ion-button class="submit-btn" full type="submit" (click)="logIn(email, password)">Entrar</button>
						</ion-col>
					</ion-row>
				</form>
				
				<ion-fab center middle>
					<button ion-fab><ion-icon name="log-in"></ion-icon></button>
					<ion-fab-list side="left">
						<button ion-fab (click)="loginWithFacebook()"><ion-icon name="logo-facebook"></ion-icon></button>
					</ion-fab-list>
					<ion-fab-list side="top">
						<button ion-fab (click)="loginWithGoogle()"><ion-icon name="logo-googleplus"></ion-icon></button>
					</ion-fab-list>
					<ion-fab-list side="right">
						<button ion-fab (click)="loginWithTwitter()"><ion-icon name="logo-twitter"></ion-icon></button>
					</ion-fab-list>
				</ion-fab>
			</div>
		</ion-content>
	`
})

export class LogIn {

	login: any;
	userProfile: any = null;
	error: any;
	zone: NgZone;

	constructor(
		public viewCtrl: ViewController,
		private userSettings: UserSettings,
		private af: AngularFire,
		private auth: AngularFireAuth) {
		//this.auth.subscribe(auth => console.log("login: ", auth.google.email));
		this.zone = new NgZone({});
		/*
		firebase.auth().onAuthStateChanged(user => {
			this.zone.run(() => {
				if (user) {
					this.userProfile = user;
				} else {
					this.userProfile = null;
				}
			});
		});
		*/
	}

	closeModal() {
		this.viewCtrl.dismiss();
	}

	logIn(email, password) {
		this.af.auth.login({ email: email.value, password: password.value })
			.then(success => {
				this.login = success;
				console.log(this.login.auth.email);
			})
			.catch((error) => console.log("Firebase failure: " + JSON.stringify(error)));
	}
	/*
		loginWithGoogle() {
			this.auth.login({ provider: AuthProviders.Google, method: AuthMethods.Popup })
				.then(success => {
					this.login = success;
					console.log(this.login.auth.email);
				})
				.catch((error) => console.log("Firebase failure: " + JSON.stringify(error)));
		}
	*/
	loginWithGoogle(){
		GooglePlus.login({
			'webClientId': "438579790140-f2siu7a7l6vvu3lch1brcmo4cn1tikas.apps.googleusercontent.com",
			'offline': true
		}).then(res => {
			firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
				.then(success => {
					console.log("Firebase success: " + JSON.stringify(success));
					this.userProfile = success;
				})
				.catch(error => {
					console.log("Firebase failure: " + JSON.stringify(error));
					this.error = error;
				});
		}).catch(err => {
			console.error("Error: ", err)
			this.error = err;
		});
	}

	loginWithFacebook() {
		Facebook.login(['email']).then((response) => {
			const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
			firebase.auth().signInWithCredential(facebookCredential)
				.then((success) => {
					console.log("Firebase success: " + JSON.stringify(success));
					this.userProfile = success;
				})
				.catch((error) => {
					console.log("Firebase failure: " + JSON.stringify(error));
				});

		}).catch((error) => { console.log(error) });
	}

	loginWithTwitter() {
		return this.auth.login({
			provider: AuthProviders.Twitter,
			method: AuthMethods.Popup,
		});
	}

}