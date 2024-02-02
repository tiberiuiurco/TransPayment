const { GraphQLJSONObject } = require("graphql-type-json");
const Company = require("../../models/companyModel");
const User = require("../../models/userModel");
const logger = require("../../winston");
const utils = require("../../utils/utils");
const Resource = require("../../models/resourceModel");
const Banks = require("../../banks.json");

const CompanyResolver = {
  JSONObject: GraphQLJSONObject,

  Query: {
    getCompanyById: async (_, { company_id }) => {
      try {
        const obj = {
          where: {
            id: company_id,
            removed: false,
          },
        };
        let res = await Company.findOne(obj);
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
    getAllCompanies: async () => {
      try {
        logger.debug({
          query: "getAllCompanies",
          message: "Attempting to Company.findAll",
        });

        return await Company.findAll({ where: { removed: false } });
      } catch (error) {
        logger.error({
          query: "getAllCompanies",
          message: "getAllCompanies failed",
          error: error.message,
        });
      }
    },
  },
  Mutation: {
    createCompany: async (_, { record, user_id }) => {
      try {
        logger.debug({
          query: "createCompany",
          message: "Attempting to Company.findOne",
        });
        record.removed = false;
				Object.keys(Banks).forEach(abbrev => {if(record["iban"].includes(abbrev)) record["bank_name"] = Banks[abbrev]});
        const response = await Company.create(record);
        if (response) {
          let userUpdate = await User.update(
            { company_id: response.id },
            { where: { id: user_id } }
          );
          if (userUpdate) {
            return response;
          }
        }

        return response;
      } catch (error) {
        logger.error({
          query: "createCompany",
          message: "createCompany failed",
          error: error.message,
        });
      }
    },
    updateCompany: async (_, { record }) => {
      try {
        logger.debug({
          query: "updateCompany",
          message: "Attempting to Company.findOne",
        });
        let response = {
          message: "Update Failed",
          status: false,
          company: null,
        };
        let old_id = record.id;
        delete record.id;
        record.removed = false;
        delete record.id;
        let created = await Company.create(record);
        created = utils.destroySequelize(created);
        if (created) {
          // Others
          const updated_user = await User.update(
            {
              company_id: created.id,
            },
            {
              where: { company_id: old_id },
            }
          );
          if (updated_user) {
            // Update other tables
            await Company.update(
              { removed: true },
              {
                where: {
                  id: old_id,
                },
              }
            );
            await Resource.update(
              {
                company_id: created.id,
              },
              {
                where: {
                  company_id: old_id,
                },
              }
            );

            response = {
              message: "Update Successful",
              status: true,
              company: created,
            };
          }
        }
        return response;
      } catch (error) {
        logger.error({
          query: "updateCompany",
          message: "updateCompany failed",
          error: error.message,
        });
      }
    },
  },

  Company: {
    __resolveReference(ref) {
      return Company.findOne({
        where: {
          id: ref.id,
        },
      });
    },
  },
};

module.exports = CompanyResolver;
