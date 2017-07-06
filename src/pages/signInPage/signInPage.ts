import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { UserSettings } from '../../services/userSettings.service';

@Component({
	selector: 'signInPage',
	templateUrl: 'signInPage.html'
})

export class SignInPage {

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private userSettings: UserSettings,
		private toastController: ToastController,
		private events: Events) { }

	signIn(email, password1, password2) {
		var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regExp.test(email.value)) {
			let toast = this.toastController.create({
				message: 'Debe introducir una dirección de email válida',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (password1.value != password2.value) {
			let toast = this.toastController.create({
				message: 'Las contraseñas deben coincidir',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (password1.value.length < 6) {
			let toast = this.toastController.create({
				message: 'La contraseña debe tener más de 5 caracteres',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (password1.value.search(/\d/) == -1) {
			let toast = this.toastController.create({
				message: 'La contraseña debe incluir un número',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}
		if (password1.value.search(/[a-zA-Z]/) == -1) {
			let toast = this.toastController.create({
				message: 'La contraseña debe incluir una letra',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return false;
		}

		this.userSettings.createUser(email.value, password1.value);
		this.events.subscribe("user::created", boolean=> {
			if (boolean) {
				this.userSettings.logIn(email.value, password1.value);
				this.navCtrl.popToRoot();
			} else {
				let toast = this.toastController.create({
					message: 'Error al crear el usuario, puede que ya exista',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
				return false;
			}
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
