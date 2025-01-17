import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {Assignments} from "../models/translation/assignments";
import {environment} from "../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class AssignmentsService {

	constructor(private _http: HttpClient) { }

	//Fetch assignments
	fetchAssignments(): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/assignments");
	}
	//Create an assignment
	createAnAssignment(payload: any): Observable<any> {
		return this._http.post(environment.apiUrl + "assign/sentences", payload);
	}
	//Fetch users assignment
	fetchUserAssignment(userId: any, batchDetailsId: number): Observable<Assignments> {
		let params = "";
		if (batchDetailsId) params = "&batchDetailsId=" + batchDetailsId;

		return this._http.get<Assignments>(environment.apiUrl + "user/translation/assignments?userId=" + userId+ params);
	}
	//Assign audio tasks
	assignAudioTasks(recorderId: number, reviewerId: number, payload: any): Observable<any> {
		return this._http.put(environment.apiUrl + "assign/audiotasks/" +recorderId+ "/" +reviewerId, payload);
	}

	//User completed assignments
	userCompletedAssignments(userId: number): Observable<any> {
		return this._http.get(environment.apiUrl + "users/completed/assignments?userId=" + userId);
	}
}
