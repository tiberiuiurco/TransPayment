
const { GraphQLJSONObject } = require("graphql-type-json");
const Flota = require("../../../models/flotaModel")
const Company = require("../../../models/companyModel");

const logger = require("../../../winston");
const utils = require("../../../utils/utils");

const sequelize = require("../../../db/db.js");
const InputPayment = require("../../../models/inputPaymentModel");

const FlotaResolver = {
	JSONObject: GraphQLJSONObject,
	Query: {
		getAllFlotaByCompanyId: async (_, { company_id }) => {
			try {
				let res = await Flota.findAll({
					where: {
						company_id: company_id,
						removed: false,
					},
				});
				res = utils.destroySequelize(res);
				let count;
				for(let el of res){
					el = utils.destroySequelize(el);
					// count = await InputPayment.count('car_plate', {where: {removed: 0, car_plate: el.car_plate}});

						count = await sequelize.query(
							`
							SELECT COUNT(*) AS cnt FROM management.input_payments IP
							WHERE IP.removed = 0 AND IP.car_plate = "${el.car_plate}";
							`,
							{ type: sequelize.QueryTypes.SELECT }
						);
					el["payments_number"] = count[0]["cnt"];
				}
				return res;
			} catch (error) {
				logger.error({
					query: "getFlotaById",
					message: "getFlotaById failed",
					error: error.message,
				});
			}
		},
		getAllFlotaByCompanyIdPagination: async (
			_,
			{ offset, limit, company_id }
		) => {
			try {
				const obj = {
					offset,
					limit,
					where: {
						company_id: company_id,
						removed: false,
					},
				};
				const response = await Flota.findAndCountAll(obj);
				return response;
			} catch (error) {
				logger.error({
					query: "getAllFlotaByCompanyIdPagination",
					message: "getAllFlotaByCompanyIdPagination failed",
					error: error.message,
				});
			}
		},
	},
	Mutation: {
		createFlota: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "createFlota",
					message: "Attempting to Flota.findOne",
				});
				if(record.id){
				const existing_resource = await Flota.findOne({
					where: {
						id: record.id,
						removed: true,
					},
				});
				if (existing_resource) return null;
				}

				if (company_id) {
					record.company_id = company_id;
					record.removed = false;
				} else return null;
				const response = await Flota.create(record);
				if (response) {
					return response;
				} else return null;
			} catch (error) {
				logger.error({
					query: "createFlota",
					message: "createFlota failed",
					error: error.message,
				});
			}
		},
		updateFlota: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "updateFlota",
					message: "Attempting to Flota.findOne",
				});
				let response = {
					message: "Update Failed",
					status: false,
					vehicle: null,
				};
				// await Flota.update(
				// 	{ removed: true },
				// 	{
				// 		where: {
				// 			id: record.id,
				// 			removed: false,
				// 		},
				// 	}
				// );
				// delete record.id;
				// record.removed = false;
				// record.company_id = company_id;
				// let created = await Flota.create(record);
				let updated = await Flota.update(
					record,
					{
						where: {
							id: record.id,
							removed: false,
						},
					}
				);
				updated = utils.destroySequelize(updated);
				if (updated) {
					// record.id = updated.id;
					response = {
						message: "Update Successful",
						status: true,
						vehicle: record,
					};
				}
				return response;
			} catch (error) {
				logger.error({
					query: "updateFlota",
					message: "updateFlota failed",
					error: error.message,
				});
			}
		},
	},
	Flota: {
		__resolveReference(ref) {
			return Flota.findOne({
				where: {
					id: ref.id,
				},
			});
		},
	},
};

module.exports = FlotaResolver;
