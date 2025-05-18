export async function POST(request: Request) {
	try {
		const data = await request.json();
		const { location } = data;
		const req = await fetch(
			`http://api.weatherapi.com/v1/search.json?key=ac6f651b9a494baf85c50206251005&q=${location}`
		);
		const res = await req.json();
		return Response.json(res);
	} catch (error) {
		return Response.json(
			{ message: "Error fetching data" },
			{ status: 500 }
		);
	}
}
