
import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "naDate"
})
export class NADatePipe extends DatePipe {

  transform(value: any, pattern?: string) {
    if (value === null || value === undefined) {
      return "N/A";
    }

    return super.transform(value, pattern);
  }

}
