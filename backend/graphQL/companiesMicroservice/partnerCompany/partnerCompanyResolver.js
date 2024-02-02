const { GraphQLJSONObject } = require("graphql-type-json");
const PartnerCompany = require("../../../models/partnerCompanyModel");

const logger = require("../../../winston");
const utils = require("../../../utils/utils");

const banks = require("./../../../banks.json");

const PartnerCompanyResolver = {
  JSONObject: GraphQLJSONObject,
  Query: {
    getAllCompanyPartnersByCompanyId: async (_, { company_id }) => {
      try {
        logger.debug({
          query: "getAllCompanyPartnersByCompanyId",
          message: "Attempting to PartnerCompany.findAll",
        });
        return await PartnerCompany.findAll({
          where: { company_id: company_id, removed: false },
        });
      } catch (error) {
        logger.error({
          query: "getAllCompanyPartnersByCompanyId",
          message: "getAllCompanyPartnersByCompanyId failed",
          error: error.message,
        });
      }
    },
    getAllCompanyPartnersByCompanyIdPagination: async (
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
        const response = await PartnerCompany.findAndCountAll(obj);
        return response;
      } catch (error) {
        logger.error({
          query: "getAllCompanyPartnersByCompanyIdPagination",
          message: "getAllCompanyPartnersByCompanyIdPagination failed",
          error: error.message,
        });
      }
    },
  },
  Mutation: {
    createPartnerCompany: async (_, { record, company_id }) => {
      try {
        logger.debug({
          query: "createCompanyPartner",
          message: "Attempting to CompanyPartner.findOne",
        });
        const existing_company_partner = await PartnerCompany.findOne({
          where: {
            cui: record.cui,
            removed: true,
          },
        });
        if (existing_company_partner) return null;

        if (company_id) {
          record.company_id = company_id;
          record.removed = false;
        } else return null;
        if (record.iban) {
          const ibans = Object.keys(banks);
          const found_bank = ibans.find(
            (term) => term == record.iban.substring(4, 8)
          );
          if (found_bank) {
            record.bank_name = banks[found_bank];
          } else {
            record.bank_name = "Banca nu a fost gasita in baza de date.";
          }
        }
        const response = await PartnerCompany.create(record);
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
    updatePartnerCompany: async (_, { record, company_id }) => {
      try {
        logger.debug({
          query: "updateCompanyPartner",
          message: "Attempting to CompanyPartner.findOne",
        });
        let response = {
          message: "Update Failed",
          status: false,
          partner: null,
        };
        const existing_company_partner = await PartnerCompany.update(
          { removed: true },
          {
            where: {
              cui: record.cui,
              removed: false,
            },
          }
        );
        delete record.id;
        record.removed = false;
        record.company_id = company_id;
        let created = await PartnerCompany.create(record);
        created = utils.destroySequelize(created);
        if (created) {
          record.id = created.id;
          response = {
            message: "Update Successful",
            status: true,
            partner: created,
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
  PartnerCompany: {
    __resolveReference(ref) {
      return PartnerCompany.findOne({
        where: {
          id: ref.id,
        },
      });
    },
  },
};

module.exports = PartnerCompanyResolver;
