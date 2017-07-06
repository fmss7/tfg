import { Component, ViewChild } from '@angular/core';
import { HttpModule } from '@angular/http';
import {
	Nav, Platform, LoadingController, ModalController,
	ViewController, Events, ToastController, AlertController
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage, TeamsPage, LeaguesPage, TeamHomePage, LeagueHomePage, SignInPage, UserPage } from '../pages/pages';
import { LPFutbolService } from '../services/lp-futbol.service';
import { UserSettings } from '../services/userSettings.service';
import { Push, PushToken } from '@ionic/cloud-angular';

@Component({
	templateUrl: 'app.html', providers: [UserSettings, HttpModule]
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;

	favoriteTeams: any[];
	favoriteLeagues: any[];
	user: any;
	rootPage: any = HomePage;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		private userSettings: UserSettings,
		private events: Events,
		private loadingController: LoadingController,
		private toastController: ToastController,
		private alertController: AlertController,
		public modalCtrl: ModalController,
		public push: Push
	) {
		this.initializeApp();
		//this.pushSetup();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
		this.push.rx.notification()
			.subscribe((notification: any) => {
				if (notification.additionalData.foreground) {
					let alert = this.alertController.create({
						title: 'New Push notification',
						message: notification.message
					});
					alert.present();
				}
			});

		this.refreshFavorites();
		this.events.subscribe("favorites:changed", () => this.refreshFavorites());
		this.refreshUser();
		this.events.subscribe("user:changed", () => this.refreshUser());
	}
	/*
	pushSetup() {
		const options: PushOptions = {
			android: {
				senderID: '679651523148'
			},
			ios: {
				alert: 'true',
				badge: true,
				sound: 'false'
			},
			windows: {}
		};

		const pushObject: PushObject = this.push.init(options);

		pushObject.on('notification').subscribe((notification: any) => {
			if (notification.additionalData.foreground) {
				let alert = this.alertController.create({
					title: 'New Push notification',
					message: notification.message
				});
				alert.present();
			}
		});
		
				pushObject.on('registration').subscribe((registration: any) => {
					//do whatever you want with the registration ID
				});
		
		pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
	}
*/

	refreshFavorites() {
		this.userSettings.getFavoriteTeams();
		this.events.subscribe("favoriteTeams:getted", favoriteTeams => {
			this.favoriteTeams = favoriteTeams;
		});

		this.userSettings.getFavoriteLeagues();
		this.events.subscribe("favoriteLeagues:getted", favoriteLeagues => {
			this.favoriteLeagues = favoriteLeagues;
		});
	}
	refreshUser() {
		this.userSettings.getLoggedUser();
		this.events.subscribe("user::getted", user => {
			this.user = user;
		});
	}

	goToAllTeams() {
		this.nav.push(TeamsPage);
	}

	goToAllLeagues() {
		this.nav.push(LeaguesPage);
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
	userTapped() {
		this.nav.push(UserPage, this.user);
	}
	logOutTapped() {
		let confirm = this.alertController.create({
			title: "LogOut",
			message: `¿Seguro que quieres salir?`,
			buttons: [
				{
					text: 'Si',
					handler: () => {
						this.userSettings.logOut();
						this.events.subscribe("logOut::done", success => {
							if (success) {
								console.log("Hacer algo...?")
							} else {
								let toast = this.toastController.create({
									message: 'Error al salir...',
									duration: 2000,
									position: 'bottom'
								});
								toast.present();
							}
						});
					}
				},
				{ text: 'No' }
			]
		});
		confirm.present();
	}
	signInTapped() {
		this.nav.push(SignInPage);
	}
}

@Component({
	template: `
		<ion-header>
			<ion-navbar color="primary">
				<ion-title>Entra</ion-title>
				<ion-buttons end>
					<button ion-button (click)="closeModal()"><ion-icon name="close-circle"></ion-icon></button>
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
									<ion-input type="email" placeholder="email" name="userEmail" #email required></ion-input>
								</ion-item>
								<ion-item>
									<ion-input type="password" placeholder="contraseña" name="userPassword" #password required></ion-input>
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

	constructor(
		public viewCtrl: ViewController,
		private userSettings: UserSettings,
		private lPFutbolService: LPFutbolService,
		private toastController: ToastController,
		private events: Events) {
	}

	closeModal() {
		this.viewCtrl.dismiss();
	}

	logIn(email, password) {
		this.userSettings.logIn(email.value, password.value);
		this.events.subscribe("logIn::done", success => {
			if (success) {
				this.viewCtrl.dismiss();
			} else {
				let toast = this.toastController.create({
					message: 'Error al acceder...',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
			}
		});
	}

	loginWithGoogle() {
		this.userSettings.loginWithGoogle();
		this.events.subscribe("loginWithGoogle::done", success => {
			if (success) {
				this.viewCtrl.dismiss();
			} else {
				let toast = this.toastController.create({
					message: 'Error al acceder...',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
			}
		});
	}

	loginWithFacebook() {
		this.userSettings.loginWithFacebook();
		this.events.subscribe("loginWithFacebook::done", success => {
			if (success) {
				this.viewCtrl.dismiss();
			} else {
				let toast = this.toastController.create({
					message: 'Error al acceder...',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
			}
		});
	}

	loginWithTwitter() {
		this.userSettings.loginWithTwitter();
		this.events.subscribe("loginWithTwitter::done", success => {
			if (success) {
				this.viewCtrl.dismiss();
			} else {
				let toast = this.toastController.create({
					message: 'Error al acceder...',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
			}
		});
	}
}