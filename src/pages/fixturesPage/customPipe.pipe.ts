import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'customPipe',
})

export class CustomPipe implements PipeTransform {

	transform(string: string): string {
		if (string == "C.E.F. Puertos Las Palmas") {
			string = "C.E.F. Puertos LP";
		} else if (string == "NULL") {
			string = "";
		}
		return string;
	}
	
}