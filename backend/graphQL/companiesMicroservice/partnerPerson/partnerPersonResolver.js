const { GraphQLJSONObject } = require("graphql-type-json");
const PartnerPerson = require("../../../models/partnerPersonModel");

const logger = require("../../../winston");
const utils = require("../../../utils/utils");

const PartnerPersonResolver = {
	JSONObject: GraphQLJSONObject,
	Query: {
		getAllPersonPartnersByCompanyId: async (_, { company_id }) => {
			try {
				logger.debug({
					query: "getAllPersonPartnersByCompanyId",
					message: "Attempting to PartnerPerson.findAll",
				});
				return await PartnerPerson.findAll({
					where: { company_id: company_id, removed: false },
				});
			} catch (error) {
				logger.error({
					query: "getAllPersonPartnersByCompanyId",
					message: "getAllPersonPartnersByCompanyId failed",
					error: error.message,
				});
			}
		},
		getAllPersonPartnersByCompanyIdPagination: async (
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
				const response = await PartnerPerson.findAndCountAll(obj);
				return response;
			} catch (error) {
				logger.error({
					query: "getAllPersonPartnersByCompanyIdPagination",
					message: "getAllPersonPartnersByCompanyIdPagination failed",
					error: error.message,
				});
			}
		},
	},
	Mutation: {
		createPartnerPerson: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "createPartnerPerson",
					message: "Attempting to PartnerPerson.findOne",
				});
				const existing_partner_person = await PartnerPerson.findOne({
					where: {
						cnp: record.cnp,
						removed: true,
					},
				});
				if (existing_partner_person) return null;

				if (company_id) {
					record.company_id = company_id;
					record.removed = false;
				} else return null;
				const response = await PartnerPerson.create(record);
				if (response) {
					return response;
				} else return null;
			} catch (error) {
				logger.error({
					query: "createPartnerPerson",
					message: "createPartnerPerson failed",
					error: error.message,
				});
			}
		},
		updatePartnerPerson: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "updatePartnerPerson",
					message: "Attempting to PartnerPerson.findOne",
				});
				let response = {
					message: "Update Failed",
					status: false,
					resource: null,
				};
				await PartnerPerson.update(
					{ removed: true },
					{
						where: {
							cnp: record.cnp,
							removed: false,
						},
					}
				);
				delete record.id;
				record.removed = false;
				record.company_id = company_id;
				let created = await PartnerPerson.create(record);
				created = utils.destroySequelize(created);
				if (created) {
					record.id = created.id;
					response = {
						message: "Update Successful",
						status: true,
						partner: record,
					};
				}
				return response;
			} catch (error) {
				logger.error({
					query: "updatePartnerPerson",
					message: "updatePartnerPerson failed",
					error: error.message,
				});
			}
		},
	},
	PartnerPerson: {
		__resolveReference(ref) {
			return PartnerPerson.findOne({
				where: {
					id: ref.id,
				},
			});
		},
	},
};

module.exports = PartnerPersonResolver;
