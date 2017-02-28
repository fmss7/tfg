import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ModalModule } from 'ng2-bootstrap/modal';

import { HomePage, TeamHomePage, LeagueHomePage, LogInPage } from '../pages/pages';
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
			<div class="login-box">
				<form (ngSubmit)="login()" #registerForm="ngForm">

					<ion-row>
						<ion-col>
							<ion-list inset>

								<ion-item>
									<ion-input type="text" placeholder="Usuario" name="userName" required></ion-input>
								</ion-item>

								<ion-item>
									<ion-input type="password" placeholder="Contraseña" name="userPassword" required></ion-input>
								</ion-item>

							</ion-list>
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col class="signup-col">
							<button color="secondary" ion-button class="submit-btn" full type="submit">Entrar</button>
						</ion-col>
					</ion-row>
				</form>
				
				<ion-fab center middle>
					<button ion-fab><ion-icon name="log-in"></ion-icon></button>
					<ion-fab-list side="left">
						<button ion-fab><ion-icon name="logo-facebook"></ion-icon></button>
					</ion-fab-list>
					<ion-fab-list side="top">
						<button ion-fab><ion-icon name="logo-googleplus"></ion-icon></button>
					</ion-fab-list>
					<ion-fab-list side="right">
						<button ion-fab><ion-icon name="logo-twitter"></ion-icon></button>
					</ion-fab-list>
					<ion-fab-list side="down">
						<button ion-fab><ion-icon name="logo-twitter"></ion-icon></button>
					</ion-fab-list>
				</ion-fab>
			</div>
		</ion-content>
	`
})

export class LogIn {
	constructor(public viewCtrl: ViewController) { }

	closeModal() {
		this.viewCtrl.dismiss();
	}
}