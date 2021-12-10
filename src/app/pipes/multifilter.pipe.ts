import { isFormattedError } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'multifilter'
})
export class MultiFilterPipe implements PipeTransform {

    transform(value: any, key: string[], texto: string): any {

        if (texto.length > 0) {
            return value.filter((info: any) => {
                let bandera = false;
                for (let index = 0; index < key.length; index++) {
                    if (key[index].indexOf('.') > -1) {
                        let arg1 = key[index].split('.')[0];
                        let arg2 = key[index].split('.')[1];
                        if (info[arg1][arg2].toLowerCase().indexOf(texto.toLowerCase()) > -1) {
                            bandera = true
                            break
                        }
                    }
                    else {
                        if (info[key[index]].toLowerCase().indexOf(texto.toLowerCase()) > -1) {
                            bandera = true
                            break
                        }
                    }

                }
                return bandera


            });

        }
        return value;
    }

}