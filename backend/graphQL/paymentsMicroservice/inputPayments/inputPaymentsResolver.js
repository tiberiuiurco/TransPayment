const { GraphQLJSONObject } = require("graphql-type-json");
const logger = require("../../../winston");
const utils = require("../../../utils/utils");
const InputPayment = require("../../../models/inputPaymentModel");
const PaymentType = require("../../../models/paymentTypeModel");
const PartnerCompany = require("../../../models/partnerCompanyModel");
const PartnerPerson = require("../../../models/partnerPersonModel");
const Resource = require("../../../models/resourceModel");
const seq = require("../../../db/db");
// const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Company = require("../../../models/companyModel");

const InputPaymentsResolver = {
	JSONObject: GraphQLJSONObject,
	Query: {
		getAllPaymentTypes: async () => {
			try {
				let res = await PaymentType.findAll({
					where: {
						removed: false,
					},
				});
				res = utils.destroySequelize(res);
				return res;
			} catch (error) {
				logger.error({
					query: "getAllPaymentTypes",
					message: "getAllPaymentTypes failed",
					error: error.message,
				});
			}
		},
		getAllInputPaymentsByCompanyId: async (_, { company_id }) => {
			try {
				const obj = {
					where: {
						company_id: company_id,
						removed: false,
					},
					include: [
						{
							model: PaymentType,
							as: "payment_type",
						},
						{
							model: PartnerCompany,
							as: "partner_company",
						},
						{
							model: PartnerPerson,
							as: "partner_person",
						},
						{
							model: Resource,
							as: "delegate",
						},
						{
							model: Resource,
							as: "emission_resource",
						},
					],
				};
				let res = await InputPayment.findAll(obj);
				res = utils.destroySequelize(res);
				return res;
			} catch (error) {
				logger.error({
					query: "getAllInputPaymentsByCompanyId",
					message: "getAllInputPaymentsByCompanyId failed",
					error: error.message,
				});
			}
		},
		getMonthIntervalInputPayments: async (_, { company_id, months_nr }) => {
			try {
				let today = new Date();
				let todaysMonth = today.getMonth();
				let todaysYear = today.getFullYear();
				let leftSide;
				let rightSide;
				switch (months_nr) {
					case 1:
						leftSide = new Date(todaysYear, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					case 2:
						leftSide = new Date(todaysYear, todaysMonth - 1, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					case 12:
						leftSide = new Date(todaysYear - 1, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					// Current Year
					case -1:
						leftSide = new Date(todaysYear, 0, 1);
						rightSide = new Date(todaysYear + 1, 0, 1);
						break;
					default:
						leftSide = new Date(todaysYear, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
				}
				const obj = {
					where: {
						company_id: company_id,
						removed: false,
						receipt_date: {
							[sequelize.Op.gte]: leftSide,
							[sequelize.Op.lt]: rightSide,
						},
					},
					include: [
						{
							model: PaymentType,
							as: "payment_type",
						},
						{
							model: PartnerCompany,
							as: "partner_company",
						},
						{
							model: PartnerPerson,
							as: "partner_person",
						},
						{
							model: Resource,
							as: "delegate",
						},
						{
							model: Resource,
							as: "emission_resource",
						},
					],
				};
				const response = await InputPayment.findAll(obj);
				return response;
			} catch (error) {
				logger.error({
					query: "getCurrentMonthInputPayments",
					message: "getCurrentMonthInputPayments failed",
					error: error.message,
				});
			}
		},
		getMonthIntervalInputPaymentsPagination: async (
			_,
			{ offset, limit, company_id, months_nr }
		) => {
			try {
				let today = new Date();
				let todaysMonth = today.getMonth();
				let todaysYear = today.getFullYear();
				let leftSide;
				let rightSide;
				switch (months_nr) {
					case 1:
						leftSide = new Date(todaysYear, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					case 2:
						leftSide = new Date(todaysYear, todaysMonth - 1, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					case 12:
						leftSide = new Date(todaysYear - 1, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
					// Current Year
					case -1:
						leftSide = new Date(todaysYear, 0, 1);
						rightSide = new Date(todaysYear + 1, 0, 1);
						break;
					default:
						leftSide = new Date(todaysYear, todaysMonth, 1);
						rightSide = new Date(todaysYear, todaysMonth + 1, 1);
						break;
				}
				const obj = {
					offset,
					limit,
					where: {
						company_id: company_id,
						removed: false,
						receipt_date: {
							[sequelize.Op.gte]: leftSide,
							[sequelize.Op.lt]: rightSide,
						},
					},
					include: [
						{
							model: PaymentType,
							as: "payment_type",
						},
						{
							model: PartnerCompany,
							as: "partner_company",
						},
						{
							model: PartnerPerson,
							as: "partner_person",
						},
						{
							model: Resource,
							as: "delegate",
						},
						{
							model: Resource,
							as: "emission_resource",
						},
					],
				};
				const response = await InputPayment.findAndCountAll(obj);
				return response;
			} catch (error) {
				logger.error({
					query: "getCurrentMonthInputPayments",
					message: "getCurrentMonthInputPayments failed",
					error: error.message,
				});
			}
		},
		getInputPaymentGraphData: async (
			_,
			{ company_id, graph_type, options }
		) => {
			try {
				let response = {
					status: false,
					message: "The Query Failed",
					data: {},
				};
				// console.log(await InputPayment.findAll());
				let numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				switch (graph_type) {
					case "annual":
						let months = {
							0: "Ianuarie",
							1: "Februarie",
							2: "Martie",
							3: "Aprilie",
							4: "Mai",
							5: "Iunie",
							6: "Iulie",
							7: "August",
							8: "Septembrie",
							9: "Octombrie",
							10: "Noiembrie",
							11: "Decembrie",
						};
						let current_year = 0;
						if (!options.year) current_year = new Date().getFullYear();
						else current_year = options.year;

						response.data["cur"] = {};
						for (let i = 0; i < 12; i++) {
							let month_start = new Date(current_year, i, 1);
							let month_end = new Date(current_year, i, numDaysInMonth[i]);
							let response_db = await InputPayment.findAll({
								where: {
									removed: false,
									company_id: company_id,
									receipt_date: {
										[sequelize.Op.between]: [month_start, month_end],
									},
								},
							});
							response_db = utils.destroySequelize(response_db);
							if (!response_db) return response;
							let sum_per_month = (function(arr) {
								let sum = 0;
								for (let i = 0; i < arr.length; i++)
									sum += parseFloat(arr[i].total);
								return sum;
							})(response_db);
							response.data["cur"][i] = sum_per_month ? sum_per_month : 0;
						}

						// Previous Year

						if (!options.year) current_year = new Date().getFullYear() - 1;
						else current_year = options.year - 1;

						response.data["prev"] = {};
						for (let i = 0; i < 12; i++) {
							let month_start = new Date(current_year, i, 1);
							let month_end = new Date(current_year, i, numDaysInMonth[i]);
							let response_db = await InputPayment.findAll({
								where: {
									removed: false,
									company_id: company_id,
									receipt_date: {
										[sequelize.Op.between]: [month_start, month_end],
									},
								},
							});
							response_db = utils.destroySequelize(response_db);
							if (!response_db) return response;
							let sum_per_month = (function(arr) {
								let sum = 0;
								for (let i = 0; i < arr.length; i++)
									sum += parseFloat(arr[i].total);
								return sum;
							})(response_db);
							response.data["prev"][i] = sum_per_month ? sum_per_month : 0;
						}
						response.status = true;
						response.message = "Success";
						break;
					case "monthly":
						// let todaysYear = new Date().getFullYear();
						let todaysYear = options.year;
						// Current Month
						let currentMonth = options.month + 1;
						let resp1 = await seq.query(
							`
SELECT DAY(receipt_date) AS day, SUM(total) AS sum FROM management.input_payments
WHERE YEAR(receipt_date) = ${todaysYear} AND MONTH(receipt_date) = ${currentMonth} AND company_id = ${company_id}
GROUP BY DAY(receipt_date)
							`,
							{ type: seq.QueryTypes.SELECT }
						);

						let totalPerDay1 = new Array(numDaysInMonth[currentMonth - 1]).fill(
							0
						);
						for (let day of resp1) totalPerDay1[day.day - 1] = day.sum;
						response.data["graph1"] = totalPerDay1;
						//
						// Previous Month
						let previousMonth = currentMonth - 1;
						if (previousMonth == 0) previousMonth = 12;
						let resp2 = await seq.query(
							`
SELECT DAY(receipt_date) AS day, SUM(total) AS sum FROM management.input_payments
WHERE YEAR(receipt_date) = ${todaysYear} AND MONTH(receipt_date) = ${previousMonth} AND company_id = ${company_id}
GROUP BY DAY(receipt_date)
							`,
							{ type: seq.QueryTypes.SELECT }
						);

						let totalPerDay2 = new Array(
							numDaysInMonth[previousMonth - 1]
						).fill(0);
						for (let day of resp2) totalPerDay2[day.day - 1] = day.sum;
						response.data["graph2"] = totalPerDay2;
						//
						// Last Year - Current Month
						let lastYear = todaysYear - 1;
						let resp3 = await seq.query(
							`
SELECT DAY(receipt_date) AS day, SUM(total) AS sum FROM management.input_payments
WHERE YEAR(receipt_date) = ${lastYear} AND MONTH(receipt_date) = ${currentMonth} AND company_id = ${company_id}
GROUP BY DAY(receipt_date)
							`,
							{ type: seq.QueryTypes.SELECT }
						);

						let totalPerDay3 = new Array(numDaysInMonth[currentMonth - 1]).fill(
							0
						);
						for (let day of resp3) totalPerDay3[day.day - 1] = day.sum;
						response.data["graph3"] = totalPerDay3;

						response.status = true;
						response.message = "Success";
						break;
				}
				return response;
			} catch (error) {
				logger.error({
					query: "getInputPaymentGraphData",
					message: "getInputPaymentGraphData failed",
					error: error.message,
				});
			}
		},
		getTop10Clients: async (_, { company_id, year }) => {
			try {
				let response = {
					status: false,
					message: "The Query Failed",
					data: {},
				};
				const beginningOfYear = new Date(year, 0, 1).toISOString();
				const endOfYear = new Date(year + 1, 0, 1).toISOString();
				const resp = await seq.query(
					`
SELECT PC.name AS PC, PP.name AS PP, SUM(total) AS sum FROM management.input_payments IP
	LEFT JOIN management.partner_companies PC ON IP.partner_company_id = PC.id
  LEFT JOIN management.partner_persons PP ON IP.partner_person_id = PP.id
	WHERE IP.receipt_date BETWEEN '${beginningOfYear}' AND '${endOfYear}' AND IP.company_id = ${company_id}
GROUP BY PC.name, PP.name
ORDER BY sum DESC
limit 10;
							`,
					{ type: seq.QueryTypes.SELECT }
				);
				if (resp && resp.length > 0) {
					const data = resp.map((result) => {
						const temp = {
							name: result.PP ? result.PP : result.PC,
							sum: result.sum,
						};
						return temp;
					});
					response.data = data;
					response.status = true;
					response.message = "Success";
				}
				return response;
			} catch (error) {
				logger.error({
					query: "getAllPaymentTypes",
					message: "getAllPaymentTypes failed",
					error: error.message,
				});
			}
		},
	},
	Mutation: {
		createInputPayment: async (_, { record }) => {
			try {
				logger.debug({
					query: "createCompany",
					message: "Attempting to InputPayment.findOne",
				});
				const current_company = await Company.findOne({
					attributes: ["id", "serie_factura", "nr_factura"],
					where: {
						id: record.company_id,
						removed: false,
					},
				});
				record["series"] = current_company["serie_factura"];
				record["number"] = current_company["nr_factura"];

				const response1 = await InputPayment.create(record);
				if (!response1) return;
				await Company.update(
					{ nr_factura: parseInt(current_company["nr_factura"]) + 1 },
					{ where: { id: current_company["id"] } }
				);
				const response = await InputPayment.findOne({
					where: {
						id: response1.id,
					},
					include: [
						{
							model: PaymentType,
							as: "payment_type",
						},
						{
							model: PartnerCompany,
							as: "partner_company",
						},
						{
							model: PartnerPerson,
							as: "partner_person",
						},
						{
							model: Resource,
							as: "delegate",
						},
						{
							model: Resource,
							as: "emission_resource",
						},
					],
				});

				return utils.destroySequelize(response);
			} catch (error) {
				logger.error({
					query: "createInputPayment",
					message: "createInputPayment failed",
					error: error.message,
				});
			}
		},
		updateInputPayment: async (_, { record }) => {
			try {
				logger.debug({
					query: "updateInputPayment",
					message: "Attempting to InputPayment.findOne",
				});
				let response = {
					message: "Update Failed",
					status: false,
					inputPayment: null,
				};
				const payment_id = record.id;
				delete record.id;
				let existing_input_payment = await InputPayment.update(record, {
					where: {
						id: payment_id,
					},
				});
				if (existing_input_payment) {
					let returned_input_payment = await InputPayment.findOne({
						where: {
							id: payment_id,
						},
						include: [
							{
								model: PaymentType,
								as: "payment_type",
							},
							{
								model: PartnerCompany,
								as: "partner_company",
							},
							{
								model: PartnerPerson,
								as: "partner_person",
							},
							{
								model: Resource,
								as: "delegate",
							},
							{
								model: Resource,
								as: "emission_resource",
							},
						],
					});
					returned_input_payment = utils.destroySequelize(
						returned_input_payment
					);
					response = {
						message: "Update Successful",
						status: true,
						inputPayment: returned_input_payment,
					};
				}
				return response;
			} catch (error) {
				logger.error({
					query: "updateInputPayment",
					message: "updateInputPayment failed",
					error: error.message,
				});
			}
		},
		markPaidByInputPaymentId: async (_, { input_payment_id }) => {
			try {
				logger.debug({
					query: "markPaidByInputPaymentId",
					message: "Attempting to InputPayment.findOne",
				});
				const response = await InputPayment.update(
					{ paid: true },
					{ where: { id: input_payment_id } }
				);
				if (response) return true;
				else return false;
			} catch (error) {
				logger.error({
					query: "markPaidByInputPaymentId",
					message: "markPaidByInputPaymentId failed",
					error: error.message,
				});
			}
		},
	},
	InputPayment: {
		__resolveReference(ref) {
			return InputPayment.findOne({
				where: {
					id: ref.id,
				},
			});
		},
	},
};

module.exports = InputPaymentsResolver;
