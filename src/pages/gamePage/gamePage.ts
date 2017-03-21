import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../../pages/pages';
import { LPFutbolService } from '../../services/lp-futbol.service';

declare var window: any;

@Component({
	selector: 'gamePage',
	templateUrl: 'gamePage.html'
})
export class GamePage {

	game: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private lPFutbolService: LPFutbolService) { }

	ionViewDidLoad() {
		this.game = this.navParams.data;
	}

	goToMap() {
		this.navCtrl.push(MapPage, this.game.id_location);
	}
	
	goToDirections() {
		this.lPFutbolService.getLocation(this.game.id_location).subscribe(res => {
			let location = res;
			window.location = `geo:${location.lati},${location.long};u=35;`;
		});
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
