import { Injectable } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";

import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class CoreMediaService {
	currentMediaQuery: string;
	onMediaUpdate: BehaviorSubject<string> = new BehaviorSubject<string>("");

	/**
   * Constructor
   *
   * @param {MediaObserver} _mediaObserver
   */
	constructor(private _mediaObserver: MediaObserver) {
		// Set the defaults
		this.currentMediaQuery = "";

		// Initialize
		this._init();
	}

	// @ Private methods
	// -----------------------------------------------------------------------------------------------------

	/**
   * Initialize
   *
   * @private
   */
	private _init(): void {
		this._mediaObserver.asObservable().pipe(debounceTime(500), distinctUntilChanged()).subscribe((change) => {
			// console.log('subscription: ', change);
			change.forEach(item => {
				if (this.currentMediaQuery !== item.mqAlias) {
					this.currentMediaQuery = item.mqAlias;
					this.onMediaUpdate.next(item.mqAlias);
				}
			});
		});
	}
}
