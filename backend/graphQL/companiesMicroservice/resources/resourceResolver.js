const { GraphQLJSONObject } = require("graphql-type-json");
const Resource = require("../../../models/resourceModel");
const Company = require("../../../models/companyModel");

const logger = require("../../../winston");
const utils = require("../../../utils/utils");

const ResourceResolver = {
	JSONObject: GraphQLJSONObject,
	Query: {
		getAllResourcesByCompanyId: async (_, { company_id }) => {
			try {
				let res = await Resource.findAll({
					where: {
						company_id: company_id,
						removed: false,
					},
				});
				res = utils.destroySequelize(res);
				return res;
			} catch (error) {
				logger.error({
					query: "getCompanyById",
					message: "getCompanyById failed",
					error: error.message,
				});
			}
		},
		getAllResourcesByCompanyIdPagination: async (
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
				const response = await Resource.findAndCountAll(obj);
				return response;
			} catch (error) {
				logger.error({
					query: "getAllResourcesByCompanyIdPagination",
					message: "getAllResourcesByCompanyIdPagination failed",
					error: error.message,
				});
			}
		},
		getAllDelegatesByCompanyId: async (_, { company_id }) => {
			try {
				let res = await Resource.findAll({
					where: {
						company_id: company_id,
						isDriver: true,
						removed: false,
					},
				});
				res = utils.destroySequelize(res);
				return res;
			} catch (error) {
				logger.error({
					query: "getCompanyById",
					message: "getCompanyById failed",
					error: error.message,
				});
			}
		},
		getAllEmitorsByCompanyId: async (_, { company_id }) => {
			try {
				let res = await Resource.findAll({
					where: {
						company_id: company_id,
						isDriver: false,
						removed: false,
					},
				});
				res = utils.destroySequelize(res);
				return res;
			} catch (error) {
				logger.error({
					query: "getCompanyById",
					message: "getCompanyById failed",
					error: error.message,
				});
			}
		},
	},
	Mutation: {
		createResource: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "createResource",
					message: "Attempting to Resource.findOne",
				});
				const existing_resource = await Resource.findOne({
					where: {
						cnp: record.cnp,
						removed: true,
					},
				});
				if (existing_resource) return null;

				if (company_id) {
					record.company_id = company_id;
					record.removed = false;
				} else return null;
				const response = await Resource.create(record);
				if (response) {
					return response;
				} else return null;
			} catch (error) {
				logger.error({
					query: "createResource",
					message: "createResource failed",
					error: error.message,
				});
			}
		},
		updateResource: async (_, { record, company_id }) => {
			try {
				logger.debug({
					query: "updateResource",
					message: "Attempting to Resource.findOne",
				});
				let response = {
					message: "Update Failed",
					status: false,
					resource: null,
				};
				await Resource.update(
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
				let created = await Resource.create(record);
				created = utils.destroySequelize(created);
				if (created) {
					record.id = created.id;
					response = {
						message: "Update Successful",
						status: true,
						resource: record,
					};
				}
				return response;
			} catch (error) {
				logger.error({
					query: "updateResource",
					message: "updateResource failed",
					error: error.message,
				});
			}
		},
	},
	Resource: {
		__resolveReference(ref) {
			return Resource.findOne({
				where: {
					id: ref.id,
				},
			});
		},
	},
};

module.exports = ResourceResolver;
