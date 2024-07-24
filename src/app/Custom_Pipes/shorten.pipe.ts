import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
    transform(value: any) {
        if (!value) return value;
        const words = value.split(' ');
        const lastWord = words.pop();
        const initials = words.map((word:string) => word.charAt(0).toUpperCase()).join('.');
        return `${initials} ${lastWord}`;
    }
}