import { Pipe, PipeTransform } from "@angular/core";

import { Grade, GradeDisplay } from "models/student";

@Pipe({
  name: "displayGrade"
})
export class DisplayGradePipe implements PipeTransform {

  transform(grade: number | Grade, args?: any): string {
    return GradeDisplay[grade];
  }

}
