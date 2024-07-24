import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators'
import { ErrorDetectionService } from './error-detection.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private errorService: ErrorDetectionService) {

    }
    getUsers() {
        return this.http.get('https://angular-training-a6f1b-default-rtdb.firebaseio.com/users.json')
            .pipe(
                catchError(this.errorService.handleError),
                map((data) => {
                let users=[]
                for (let key in data) {
                    users.push({...data[key], key:key})
                }
                return users
            }))
    }
    createUsers(data) {
        return this.http.post('https://angular-training-a6f1b-default-rtdb.firebaseio.com/users.json', data).pipe(
            catchError(this.errorService.handleError)
        )
    }
    removeAll() {
        return this.http.delete('https://angular-training-a6f1b-default-rtdb.firebaseio.com/users.json').pipe(
            catchError(this.errorService.handleError)
        )
    }
    removeOne(key) {
        return this.http.delete(`https://angular-training-a6f1b-default-rtdb.firebaseio.com/users/${key}.json`,
            {
                observe:'events'
            }
        ).pipe(
            catchError(this.errorService.handleError)
        )
    }
    edit(user) {
        return this.http.patch(`https://angular-training-a6f1b-default-rtdb.firebaseio.com/users/${user.key}.json`, {
            date: user.data,
            as: user.as
        },
    {
        observe:'events'
    }).pipe(
        catchError(this.errorService.handleError)
    )
    }
}