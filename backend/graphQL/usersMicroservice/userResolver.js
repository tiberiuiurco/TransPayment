const { GraphQLJSONObject } = require("graphql-type-json");
const User = require("../../models/userModel");
const Company = require("../../models/companyModel");
//var generatePassword = require("password-generator");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const logger = require("../../winston");
const utils = require("../../utils/utils");
const Enroll = require("../../models/enrollModel");

const UserResolver = {
  JSONObject: GraphQLJSONObject,
  Query: {
    getUserById: async (_, { user_id }) => {
      try {
        const obj = {
          where: {
            id: user_id,
          },
          include: [
            {
              model: Company,
              as: "company",
            },
          ],
        };
        let res = await User.findOne(obj);
        res = utils.destroySequelize(res);
        return res;
      } catch (error) {
        logger.error({
          query: "getUserById",
          message: "getUserById failed",
          error: error.message,
        });
      }
    },
    getAllEnrolls: async (_, { company_id }) => {
      try {
        const obj = {
          where: {
						company_id: company_id,
						removed: false
          },
          include: [
            {
              model: Company,
              as: "company",
            },
            {
              model: User,
              as: "user",
            },
          ],
        };
        let res = await Enroll.findAll(obj);
        res = utils.destroySequelize(res);
        return res;
      } catch (error) {
        logger.error({
          query: "getAllEnrolls",
          message: "getAllEnrolls failed",
          error: error.message,
        });
      }
    },
		
  },
  User: {
    __resolveReference(ref) {
      return User.findOne({
        where: {
          id: ref.id,
        },
      });
    },
  },

  Mutation: {
    register: async (
      _,
      { last_name, first_name, cnp, email, username, password }
    ) => {
      try {
        //const password = generatePassword(9, false);

        const obj = {
          where: {
            email,
          },
        };

        logger.debug({
          query: "register",
          message: "Attempting to User.findOne",
        });
        let user = await User.findOne(obj);

        if (user) {
          return {
            message: "User already registered",
          };
        } else {
          let hashed_pass = await bcrypt.hash(password, 10);
          if (hashed_pass) {
            logger.debug({
              query: "register",
              message: "Attempting to User.create",
            });
            const createdUser = await User.create({
              first_name,
              last_name,
              cnp,
              email,
              username,
              password: hashed_pass,
							role: 2,
            });
            if (createdUser) {
              return {
                response: {
                  id: createdUser.dataValues.id,
                  email: createdUser.dataValues.email,
                  password: createdUser.dataValues.password,
                  first_name: createdUser.dataValues.first_name,
									role: 2,
                },
                actual_password: password,
                email,
                message: "The user has been added.",
              };
            } else {
              logger.warn({
                query: "register",
                message: "User.create problem",
              });
              return {
                message: "Something went wrong. Try again later.",
              };
            }
          } else {
            logger.warn({
              query: "register",
              message: "bcrypt.hash problem",
            });
          }
        }
      } catch (error) {
        logger.error({
          query: "register",
          message: "register failed",
          error: error.message,
        });
      }
    },

    login: async (_, { email, password }) => {
      try {
        const obj = {
          where: {
            email,
          },
        };
        logger.debug({
          query: "login",
          message: "Attempting to User.findOne",
        });
        let user = await User.findOne(obj);
        if (!user) {
          return {
            message: "Incorrect email!",
          };
        } else {
          let verified = await bcrypt.compare(password, user.password);
          if (!verified) {
            return {
              message: "Incorrect password!",
            };
          } else {
            delete user.removed;
            delete user.password;
            user.token = jsonwebtoken.sign(
              {
                token: user,
              },
              "secret"
            );

            return user;
          }
        }
      } catch (error) {
        logger.error({
          query: "login",
          message: "login failed",
          error: error.message,
        });
      }
    },
    setEnroll: async (_, { user_id, email, description }) => {
      try {
        logger.debug({
          query: "setEnroll",
          message: "Attempting to setEnroll",
        });
				let response = {
					success: false,
					what_company: null
				};
				let target_company = await Company.findOne({where: {email: email}});
				if(!target_company){
					return response;
				}

				target_company = destroySequelize(target_company);

				let to_be_inserted = {
					user_id: user_id,
					company_id: target_company["id"],
					description: description,
					removed: false,
				};
				let set_response = await Enroll.create(to_be_inserted);
				if(set_response){
					response = {
						success: true,
						what_company: target_company.name
					};
				}
				return response;

      } catch (error) {
        logger.error({
          query: "setEnroll",
          message: "setEnroll failed",
          error: error.message,
        });
      }
    },

    acceptEnroll: async (_, { enroll_id }) => {
      try {
        logger.debug({
          query: "acceptEnroll",
          message: "Attempting to acceptEnroll",
        });
				let response = {
					success: false,
				};

				let found_enroll = await Enroll.findOne({where: {id: enroll_id}});
				found_enroll = destroySequelize(found_enroll);

				await User.update({company_id: found_enroll.company_id, role: 3}, {where: {id: found_enroll.user_id}});
				let updated = await Enroll.update({removed: true}, {where: {id: enroll_id}});
				if(updated)
					response.success = true;

				return response;

      } catch (error) {
        logger.error({
          query: "acceptEnroll",
          message: "acceptEnroll failed",
          error: error.message,
        });
      }
    },
  },
};

module.exports = UserResolver;
