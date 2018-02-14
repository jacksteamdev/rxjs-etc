/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
import { concat } from "rxjs/observable/concat";
import { debounceTime } from "rxjs/operators/debounceTime";
import { publish } from "rxjs/operators/publish";
import { take } from "rxjs/operators/take";
import { IScheduler } from "rxjs/Scheduler";

export function debounceTimeSubsequent<T>(
    duration: number,
    scheduler?: IScheduler
): (source: Observable<T>) => Observable<T> {

    return (source: Observable<T>) => Observable.create((observer: Observer<T>) => {
        const published = source.pipe(publish()) as ConnectableObservable<T>;
        const subscription = concat(
            published.pipe(take(1)),
            published.pipe(debounceTime(duration, scheduler))
        ).subscribe(observer);
        subscription.add(published.connect());
        return subscription;
    });
}