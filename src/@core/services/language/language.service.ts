import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Language} from "../../models/language/language";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class LanguageService {
	constructor(private httpClient: HttpClient) {
	}

	getLanguages(): Observable<Language[]> {
		return this.httpClient.get<Language[]>(`${environment.apiUrl}languages`);
	}
}
