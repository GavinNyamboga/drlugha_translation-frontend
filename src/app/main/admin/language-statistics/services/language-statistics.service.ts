import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { LanguageStatics } from "../model/language-statistics";

@Injectable({
    providedIn: "root"
})

export class LanguageStatisticsService {
    private apiUrl = environment.apiUrl;
    constructor (private httpClient: HttpClient) {

    }

    getLanguageStatistics(): Observable<LanguageStatics[]> {
        return this.httpClient.get<LanguageStatics[]>(`${this.apiUrl}stats/languages`)
    }
}