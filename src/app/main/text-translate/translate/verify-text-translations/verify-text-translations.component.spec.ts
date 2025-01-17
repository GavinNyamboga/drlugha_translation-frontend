import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VerifyTextTranslationsComponent } from "./verify-text-translations.component";

describe("VerifyTranslationsComponent", () => {
	let component: VerifyTextTranslationsComponent;
	let fixture: ComponentFixture<VerifyTextTranslationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ VerifyTextTranslationsComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VerifyTextTranslationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
