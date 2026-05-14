import type {
	Itinerary,
	Place,
	plan,
	PlanResponse
} from '@motis-project/motis-client';
import type { Location } from '$lib/Location';
import polyline from '@mapbox/polyline';

export const joinInterlinedLegs = (it: Itinerary) => {
	const joinedLegs = [];
	for (let i = 0; i < it.legs.length; i++) {
		if (it.legs[i].interlineWithPreviousLeg) {
			const pred = joinedLegs[joinedLegs.length - 1];
			const curr = it.legs[i];
			pred.intermediateStops!.push({ ...pred.to, switchTo: curr } as Place);
			pred.to = curr.to;
			pred.duration += curr.duration;
			pred.endTime = curr.endTime;
			pred.scheduledEndTime = curr.scheduledEndTime;
			pred.realTime ||= curr.realTime;
			pred.intermediateStops!.push(...curr.intermediateStops!);
			pred.legGeometry = {
				points: polyline.encode(
					[
						...polyline.decode(pred.legGeometry.points, pred.legGeometry.precision),
						...polyline.decode(curr.legGeometry.points, curr.legGeometry.precision)
					],
					pred.legGeometry.precision
				),
				precision: pred.legGeometry.precision,
				length: pred.legGeometry.length + curr.legGeometry.length
			};
		} else {
			joinedLegs.push(it.legs[i]);
		}
	}
	it.legs = joinedLegs;
};

export const preprocessItinerary = (from: Location, to: Location) => {
	const updateItinerary = (it: Itinerary) => {
		if (it.legs[0].from.name === 'START') {
			it.legs[0].from.name = from.label!;
		}
		if (it.legs[it.legs.length - 1].to.name === 'END') {
			it.legs[it.legs.length - 1].to.name = to.label!;
		}
		joinInterlinedLegs(it);
	};

	return (r: Awaited<ReturnType<typeof plan>>): PlanResponse => {
		if ('error' in r && r.error) throw { error: r.error.error, status: r.response.status };
		const data = r.data;
		if (!data) throw { error: 'Missing response data', status: 500 };
		data.itineraries.forEach(updateItinerary);
		data.direct.forEach(updateItinerary);

		return data;
	};
};
