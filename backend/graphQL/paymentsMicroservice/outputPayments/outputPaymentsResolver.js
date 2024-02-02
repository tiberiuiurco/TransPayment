const { GraphQLJSONObject } = require("graphql-type-json");
const logger = require("../../../winston");
const utils = require("../../../utils/utils");
const OutputPayment = require("../../../models/outputPaymentModel");
const seq = require("../../../db/db");
// const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Company = require("../../../models/companyModel");

const OutputPaymentsResolver = {
  JSONObject: GraphQLJSONObject,
  Query: {
    getAllOutputPaymentsByCompanyId: async (_, { company_id }) => {
      try {
        const obj = {
          where: {
            company_id: company_id,
            removed: false,
          },
        };
        let res = await OutputPayment.findAll(obj);
        res = utils.destroySequelize(res);
        return res;
      } catch (error) {
        logger.error({
          query: "getAllOutputPaymentsByCompanyId",
          message: "getAllOutputPaymentsByCompanyId failed",
          error: error.message,
        });
      }
    },
    getMonthIntervalOutputPayments: async (_, { company_id, months_nr }) => {
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
            payment_date: {
              [sequelize.Op.gte]: leftSide,
              [sequelize.Op.lt]: rightSide,
            },
          },
        };
        const response = await OutputPayment.findAll(obj);
        return response;
      } catch (error) {
        logger.error({
          query: "getCurrentMonthOutputPayments",
          message: "getCurrentMonthOutputPayments failed",
          error: error.message,
        });
      }
    },
    getMonthIntervalOutputPaymentsPagination: async (
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
            payment_date: {
              [sequelize.Op.gte]: leftSide,
              [sequelize.Op.lt]: rightSide,
            },
          },
        };
        const response = await OutputPayment.findAndCountAll(obj);
        return response;
      } catch (error) {
        logger.error({
          query: "getCurrentMonthOutputPayments",
          message: "getCurrentMonthOutputPayments failed",
          error: error.message,
        });
      }
    },
    getVatStatisticsData: async (_, { company_id, options }) => {
      try {
        let response = {
          status: false,
          message: "The Query Failed",
          data: {},
        };

        const selected_month = options.month;
        const selected_year = options.year;
        let sectionData = {};

        // Information to manipulate the data
        let currentMonth;
        let previousMonth;
        let currentYear;
        let previousYear;
        let lowerYearDate;
        let higherYearDate;
        let lowerMonthDate;
        let higherMonthDate;
        // VAT
        previousYear = selected_year - 1;
        previousMonth = selected_month - 1;
        if (previousMonth == 0) previousMonth = 12;
        // MONTH && Received
        lowerMonthDate = new Date(selected_year, selected_month - 1, 1);
        higherMonthDate = new Date(selected_year, selected_month, 1);
        sectionData["vat"] = {
          month: {
            received: 0,
            sent: 0,
          },
          year: {
            received: 0,
            sent: 0,
          },
        };

        let monthVatReceived = await seq.query(
          `
          SELECT SUM(vat_value) as sum FROM input_payments 
          WHERE company_id = ${company_id} 
            AND removed = false 
            AND YEAR(receipt_date) = ${selected_year} 
            AND MONTH(receipt_date) = ${selected_month}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (monthVatReceived && monthVatReceived[0] && monthVatReceived[0].sum)
          sectionData["vat"].month.received = monthVatReceived[0].sum;
        else sectionData["vat"].month.received = 0;

        // MONTH && Sent
        let monthVatSent = await seq.query(
          `
          SELECT SUM(vat_value) as sum FROM output_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(payment_date) = ${selected_year}
            AND MONTH(payment_date) = ${selected_month}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (monthVatSent && monthVatSent[0] && monthVatSent[0].sum)
          sectionData["vat"].month.sent = monthVatSent[0].sum;
        else sectionData["vat"].month.sent = 0;

        sectionData["vat"].month.total = (
          sectionData["vat"].month.received - sectionData["vat"].month.sent
        ).toFixed(2);
        // YEAR && Received
        let yearVatReceived = await seq.query(
          `
          SELECT SUM(vat_value) as sum FROM input_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(receipt_date) = ${selected_year}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (yearVatReceived && yearVatReceived[0] && yearVatReceived[0].sum)
          sectionData["vat"].year.received = yearVatReceived[0].sum;
        else sectionData["vat"].year.received = 0;

        // YEAR && Sent
        let yearVatSent = await seq.query(
          `
          SELECT SUM(vat_value) as sum FROM output_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(payment_date) = ${selected_year}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (yearVatSent && yearVatSent[0] && yearVatSent[0].sum)
          sectionData["vat"].year.sent = yearVatSent[0].sum;
        else sectionData["vat"].year.sent = 0;

        sectionData["vat"].year.total = (
          sectionData["vat"].year.received - sectionData["vat"].year.sent
        ).toFixed(2);

        // SOLD
        sectionData["sold"] = {
          month: {
            received: 0,
            sent: 0,
          },
          year: {
            received: 0,
            sent: 0,
          },
        };

        // MONTH && Received
        let monthSoldReceived = await seq.query(
          `
          SELECT SUM(total) as sum FROM input_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(receipt_date) = ${selected_year}
            AND MONTH(receipt_date) = ${selected_month}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (
          monthSoldReceived &&
          monthSoldReceived[0] &&
          monthSoldReceived[0].sum
        )
          sectionData["sold"].month.received = monthSoldReceived[0].sum;
        else sectionData["sold"].month.received = 0;

        // MONTH && Sent
        let monthSoldSent = await seq.query(
          `
          SELECT SUM(total) as sum FROM output_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(payment_date) = ${selected_year}
            AND MONTH(payment_date) = ${selected_month}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (monthSoldSent && monthSoldSent[0] && monthSoldSent[0].sum)
          sectionData["sold"].month.sent = monthSoldSent[0].sum;
        else sectionData["sold"].month.sent = 0;

        sectionData["sold"].month.total = (
          sectionData["sold"].month.received - sectionData["sold"].month.sent
        ).toFixed(2);

        // YEAR && Received
        let yearSoldReceived = await seq.query(
          `
          SELECT SUM(total) as sum FROM input_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(receipt_date) = ${selected_year}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (yearSoldReceived && yearSoldReceived[0] && yearSoldReceived[0].sum)
          sectionData["sold"].year.received = yearSoldReceived[0].sum;
        else sectionData["sold"].year.received = 0;

        // YEAR && Sent
        let yearSoldSent = await seq.query(
          `
          SELECT SUM(total) as sum FROM output_payments
          WHERE company_id = ${company_id}
            AND removed = false
            AND YEAR(payment_date) = ${selected_year}
          `,
          { type: seq.QueryTypes.SELECT }
        );
        if (yearSoldSent && yearSoldSent[0] && yearSoldSent[0].sum)
          sectionData["sold"].year.sent = yearSoldSent[0].sum;
        else sectionData["sold"].year.sent = 0;

        sectionData["sold"].year.total = (
          sectionData["sold"].year.received - sectionData["sold"].year.sent
        ).toFixed(2);

        response.data = sectionData;
        response.status = true;
        response.message = "The Query Succeeded";
        return response;
      } catch (error) {
        logger.error({
          query: "getInputPaymentGraphData",
          message: "getInputPaymentGraphData failed",
          error: error.message,
        });
      }
    },
  },
  Mutation: {
    createOutputPayment: async (_, { record }) => {
      try {
        logger.debug({
          query: "createCompany",
          message: "Attempting to OutputPayment.findOne",
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

        const response1 = await OutputPayment.create(record);
        if (!response1) return;
        await Company.update(
          { nr_factura: parseInt(current_company["nr_factura"]) + 1 },
          { where: { id: current_company["id"] } }
        );
        const response = await OutputPayment.findOne({
          where: {
            id: response1.id,
          },
        });

        return utils.destroySequelize(response);
      } catch (error) {
        logger.error({
          query: "createOutputPayment",
          message: "createOutputPayment failed",
          error: error.message,
        });
      }
    },
    updateOutputPayment: async (_, { record }) => {
      try {
        logger.debug({
          query: "updateOutputPayment",
          message: "Attempting to OutputPayment.findOne",
        });
        let response = {
          message: "Update Failed",
          status: false,
          outputPayment: null,
        };
        const payment_id = record.id;
        delete record.id;
        let existing_output_payment = await OutputPayment.update(record, {
          where: {
            id: payment_id,
          },
        });
        if (existing_output_payment) {
          let returned_output_payment = await OutputPayment.findOne({
            where: {
              id: payment_id,
            },
          });
          returned_output_payment = utils.destroySequelize(
            returned_output_payment
          );
          response = {
            message: "Update Successful",
            status: true,
            outputPayment: returned_output_payment,
          };
        }
        return response;
      } catch (error) {
        logger.error({
          query: "updateOutputPayment",
          message: "updateOutputPayment failed",
          error: error.message,
        });
      }
    },
  },
  OutputPayment: {
    __resolveReference(ref) {
      return OutputPayment.findOne({
        where: {
          id: ref.id,
        },
      });
    },
  },
};

module.exports = OutputPaymentsResolver;
