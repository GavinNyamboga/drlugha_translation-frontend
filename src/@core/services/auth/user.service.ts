import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {environment} from "../../../environments/environment";
import {UserStats} from "../../models/user/user-stats";
import {StatsPerUser} from "../../models/user/stats-per-user";
import {map} from "rxjs/operators";
import {UserBatchDetailsStats} from "../../models/user/user-batch-details-stats";


@Injectable({
	providedIn: "root"
})
export class UserService {

	constructor(private _http: HttpClient) {}

	//Fetch all users
	fetchAllUsers(): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/users");
	}

	//Register user
	registerUser(payload: any): Observable<any> {
		return this._http.post(environment.apiUrl + "create/user", payload);
	}

	//Update user details
	updateUser(payload, userId): Observable<any> {
		return this._http.put(environment.apiUrl + "update/user/"+ userId, payload );
	}

	//Delete user

	//Fetch User by id
	fetchUserById(userId: number): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/user/" + userId);
	}

	//Update user status
	//change user password
	changePassword(payload: any, userId: any):Observable<any> {
		return this._http.put(environment.apiUrl + "update/userpassword/" + userId , payload);
	}

	usersStats(selectedOption: "text" | "audio"): Observable<UserStats[]> {
		return this._http.get<UserStats[]>(environment.apiUrl + `stats/users?batchType=${selectedOption}`);
	}

	statsPerUser(userId: number): Observable<StatsPerUser> {
		return this._http.get<StatsPerUser>(environment.apiUrl + "stats/user?userId=" + userId)
			.pipe(map((statsPerUser: StatsPerUser) => new StatsPerUser(statsPerUser)));
	}

	userBatchDetailsStats(userId: number): Observable<UserBatchDetailsStats> {
		return this._http.get<UserBatchDetailsStats>(environment.apiUrl + "stats/user/batch-details?userId=" + userId);
	}

}

