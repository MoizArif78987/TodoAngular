import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedReq = req.clone({
            headers: req.headers.append('auth', "Bearer token")
        });

        return next.handle(modifiedReq).pipe(
            map((event) => {
                if (event.type === HttpEventType.Response && event instanceof HttpResponse) {
                    for (let value in event.body) {
                        if (!event.body[value].hasOwnProperty('as')) { 
                            event.body[value]= {...event.body[value], as:"ASE"}
                        }
                    }
                }
                return event;
            })
        );
    }
}
