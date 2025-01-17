import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStatsComponent } from "./user-stats.component";

describe("UserReportsComponent", () => {
	let component: UserStatsComponent;
	let fixture: ComponentFixture<UserStatsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UserStatsComponent ]
		})
			.compileComponents();

		fixture = TestBed.createComponent(UserStatsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
