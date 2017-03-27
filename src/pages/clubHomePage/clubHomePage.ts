import { Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ClubSheetPage, ClubTeamsPage } from '../pages';

@Component({
	selector: 'clubHomePage',
	templateUrl: 'clubHomePage.html'
})
export class ClubHomePage {

	club: any;
	storage: any;
	clubSheetTab = ClubSheetPage;
	clubTeamsTab = ClubTeamsPage;
	badgesUrl: string = 'gs://lp-futbol-cfeff.appspot.com/escudos/';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams) {
		this.club = this.navParams.data;
	}

	ionViewDidLoad() {
	}

	goHome() {
		this.navCtrl.popToRoot();
	}

}
