import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { UserSettings } from '../../services/userSettings.service';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
	selector: 'userPage',
	templateUrl: 'userPage.html'
})
export class UserPage {

	user: any;
	favoriteTeams = [];
	favoriteLeagues = [];
	changingEmail: boolean;
	changingPassword: boolean;
	newEmail: string;
	password: string;
	newPassword1: string;
	newPassword2: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private toastController: ToastController,
		private userSettings: UserSettings) {
		this.user = this.navParams.data;
	}

	ionViewDidLoad() {
		this.changingEmail = false;
		this.changingPassword = false;
		_.forEach(this.user.favoriteTeams, favTeam => {
			this.favoriteTeams.push(favTeam);
		});

		_.forEach(this.user.favoriteLeagues, favLeagues => {
			this.favoriteLeagues.push(favLeagues);
		});
	}

	changeEmail() {
		this.changingEmail = true;
	}
	saveEmail() {
		var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regExp.test(this.newEmail)) {
			let toast = this.toastController.create({
				message: 'Debe introducir una dirección de email válida',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.newEmail == this.user.email) {
			let toast = this.toastController.create({
				message: 'Las direcciones de correo son las mismas',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (Md5.hashStr(this.password) != this.user.password) {
			let toast = this.toastController.create({
				message: 'Contraseña incorrecta',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		this.userSettings.updateEmail(this.newEmail);
		this.events.subscribe("userEmail::updated", boolean => {
			if (boolean) {
				this.userSettings.logIn(this.newEmail, this.password);
				this.events.subscribe("logIn::done", boolean => {
					if (boolean) {
						let toast = this.toastController.create({
							message: 'Email actualizado',
							duration: 1500,
							position: 'bottom'
						});
						toast.present();
						this.user.email = this.newEmail;
						this.newEmail = "";
						this.password = "";
						this.changingEmail = false;
					}
				});
			}
		});

	}
	cancelEmail() {
		this.changingEmail = false;
	}

	changePassword() {
		this.changingPassword = true;
	}
	savePassword() {
		if (Md5.hashStr(this.password) != this.user.password) {
			let toast = this.toastController.create({
				message: 'Contraseña incorrecta',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.newPassword1 != this.newPassword2) {
			let toast = this.toastController.create({
				message: 'Las contraseñas deben coincidir',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (Md5.hashStr(this.password) == Md5.hashStr(this.newPassword1)) {
			let toast = this.toastController.create({
				message: 'Las contraseñas son la misma',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.newPassword1.length < 6) {
			let toast = this.toastController.create({
				message: 'La contraseña debe tener más de 5 caracteres',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.newPassword1.search(/\d/) == -1) {
			let toast = this.toastController.create({
				message: 'La contraseña debe incluir un número',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (this.newPassword1.search(/[a-zA-Z]/) == -1) {
			let toast = this.toastController.create({
				message: 'La contraseña debe incluir una letra',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		this.userSettings.updatePassword(this.newPassword1);
		this.events.subscribe("password::updated", boolean => {
			if (boolean) {
				this.userSettings.logIn(this.user.email, this.newPassword1);
				this.events.subscribe("logIn::done", boolean => {
					if (boolean) {
						let toast = this.toastController.create({
							message: 'Contraseña actualizada',
							duration: 1500,
							position: 'bottom'
						});
						toast.present();
						this.password = "";
						this.newPassword1 = "";
						this.newPassword2 = "";
						this.changingPassword = false;
					}
				});
			}
		});
	}

	cancelPassword() {
		this.changingPassword = false;
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
