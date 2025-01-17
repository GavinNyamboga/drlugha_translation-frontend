import {animate, style, transition, trigger} from "@angular/animations";

export const slideInOutAnimation = trigger("slideInOut", [
	transition(":enter", [
		style({ transform: "translateY(-200%)" }),
		animate("200ms ease-in", style({
			transform: "translateY(0%)",
			opacity: 1
		}))
	]),
	transition(":leave", [
		animate("200ms ease-in", style({
			transform: "translateY(300%)",
			opacity: 0
		}))
	])
]);
