import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
//import { AgmCoreModule } from 'angular2-google-maps/core';

declare var window: any;

@Component({
    selector: 'mapPage',
    templateUrl: 'mapPage.html',

})
export class MapPage {

    map: any;
    constructor(public navParams: NavParams, public navCtrl: NavController) { }

    ionViewDidLoad() {
        let team = this.navParams.data;

        this.map = {
            lati: team.pitch.lati,
            long: team.pitch.long,
            zoom: 16,
            markerLabel: team.pitch.address
        };
    }

	goHome() {
		this.navCtrl.popToRoot();
	}

    getDirections() {
        window.location = `geo:${this.map.lat},${this.map.lng};u=35`;
    }

}
