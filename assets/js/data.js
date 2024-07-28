// ----------------------
//  TAX TABLES
// ----------------------

const taxCondition = [{
	"resident": [{
		"2324": [
			{ "income": 0,		"tax": 0 },
			{ "income": 18201,	"tax": 0.19 },
			{ "income": 45001,	"tax": 0.325 },
			{ "income": 120001,	"tax": 0.37 },
			{ "income": 180001,	"tax": 0.45 },
		],
		"2425": [
			{ "income": 0,		"tax": 0 },
			{ "income": 18201,	"tax": 0.16 },
			{ "income": 45001,	"tax": 0.30 },
			{ "income": 120001,	"tax": 0.37 },
			{ "income": 180001,	"tax": 0.45 },
		],
	}],
	"whm": [{
		"2324": [
			{ "income": 0,		"tax": 0.15 },
			{ "income": 45001,	"tax": 0.325 },
			{ "income": 120001,	"tax": 0.37 },
			{ "income": 180001,	"tax": 0.45 },
		],
		"2425": [
			{ "income": 0,		"tax": 0.15 },
			{ "income": 45001,	"tax": 0.30 },
			{ "income": 120001,	"tax": 0.37 },
			{ "income": 180001,	"tax": 0.45 },
		],
	}],
}];