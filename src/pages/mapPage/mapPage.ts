import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { LPFutbolService } from '../../services/lp-futbol.service';
//import { AgmCoreModule } from 'angular2-google-maps/core';

declare var window: any;

@Component({
	selector: 'mapPage',
	templateUrl: 'mapPage.html',

})
export class MapPage {

	map: any;
	location: any;

	constructor(
		public navParams: NavParams,
		public navCtrl: NavController,
		private loadingController: LoadingController,
		private lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {
		let loader = this.loadingController.create({
			content: 'Obteniendo coordenadas...',
			spinner: 'bubbles'
		});
		loader.present().then(() => {
			this.lPFutbolService.getLocation(this.navParams.data).subscribe(res => {
				this.location = res;
				this.map = {
					lati: this.location.lati,
					long: this.location.long,
					zoom: 16,
					markerLabel: this.location.address
				};

			});
			loader.dismiss();
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

	getDirections() {
		window.location = `geo:${this.map.lati},${this.map.long};u=35`;
	}

}
