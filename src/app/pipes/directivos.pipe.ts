import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "directivos",
})
export class DirectivosPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    // console.log("value: ", value);
    // console.log("arg: ", arg);
    if (arg === "" || arg.length < 1) return value;
    const resultName = [];
    for (const name of value) {
      if (name.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultName.push(name);
      }
    }
    return resultName;
  }
}