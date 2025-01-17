import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class UserStatisticsService {
	private apiUrl = environment.apiUrl;
	constructor(private httpClient: HttpClient) {
	}

	getUserStatistics(startDate, endDate, batchType: "text" | "audio") {
		return this.httpClient.get(`${this.apiUrl}stats/users/range?startDate=${startDate}&endDate=${endDate}&batchType=${batchType}`);
	}
}
