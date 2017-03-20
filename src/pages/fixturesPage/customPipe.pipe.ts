import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'customPipe',
})

export class CustomPipe implements PipeTransform {

	transform(teamName: string): string {
		teamName == "C.E.F. Puertos Las Palmas" ? teamName = "C.E.F. Puertos LP" : teamName = teamName;
		return teamName;
	}

}