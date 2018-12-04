// Standard Node modules
const Path = require("path");

// Knex
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "amish_mishra",
        user:"amish_mishra",
        password: "bonepoje"
    }
});

// Hapi
const Joi = require("joi"); // Input validation
const Hapi = require("hapi"); // Server

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "dist")
        }
    }
});

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true
        }
    });

    // Configure static file service.
    await server.register([require("inert"), require("lout"), require("vision")]);

    // Configure routes.
    server.route([
        // {
        //     method: "POST",
        //     path: "/api/accounts",
        //     config: {
        //         description: "Sign up for an account",
        //         validate: {
        //             payload: {
        //                 firstName: Joi.string().required(),
        //                 lastName: Joi.string().required(),
        //                 email: Joi.string()
        //                     .email()
        //                     .required(),
        //                 password: Joi.string().required()
        //             }
        //         }
        //     },
        //     handler: async (request, h) => {
        //         let resultSet = await knex("accounts")
        //             .select()
        //             .where("email", request.payload.email);
        //         if (resultSet.length > 0) {
        //             return {
        //                 ok: false,
        //                 msge: `The account '${request.payload.email}' is already in use`
        //             };
        //         }

        //         let result = await knex("accounts").insert({
        //             firstname: request.payload.firstName,
        //             lastname: request.payload.lastName,
        //             email: request.payload.email,
        //             password: request.payload.password
        //         });

        //         if (result.rowCount === 1) {
        //             return {
        //                 ok: true,
        //                 msge: `Created account '${request.payload.email}'`
        //             };
        //         } else {
        //             return {
        //                 ok: false,
        //                 msge: `Couldn't add '${
        //                     request.payload.email
        //                 }' to the database`
        //             };
        //         }
        //     }
        // },
        {
            method: "POST",
            path: "/api/members",
            config: {
                description: "Login to Rendezvous",
                validate: {
                    payload: {
                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("members")
                    .select()
                    .where("email", request.payload.email);
                if (resultSet.length > 0) {
                    resultSet = resultSet[0];
                    if(true){//resultSet.password === request.payload.password){
                        return {
                            ok: true,
                            msge: `Welcome '${request.payload.email}'`
                        }
                    } 
                }

                return {
                    ok: false,
                    msge: `Your email or Password are incorrect.`
                };
            }
        },
        {
            method: "GET",
            path: "/api/teams",
            config: {
                description: "Get current member active teams",

            },
            handler: async (request, h) => {
                let email = request.query.email;
                let team = request.query.teamName;
                if(email!=null){
                    let resultSet = await knex("teams")
                    .select()
                    .from("teams AS t")
                    .innerJoin("members_teams AS mt",  "mt.team_name","t.team_name")
                    .where("email",email);
                    // console.log(resultSet);
                    let teamNames = [];
                    for(i = 0; i < resultSet.length; i++){
                        teamNames.push(resultSet[i].team_name);
                    }
                    return teamNames;
                }
                if(team != null){
                    let resultSet = await knex("teams")
                    .select()
                    .from("members AS m")
                    .innerJoin("members_teams AS mt",  "mt.email","m.email")
                    .where("team_name", team);
                    // console.log(resultSet);
                    let members = [];
                    for(i = 0; i < resultSet.length; i++){
                        members.push(resultSet[i].email);
                    }
                    return members;
                }
            }
        },
        {
            method: "GET",
            path: "/api/core_hours",
            config: {
                description: "Get the core hours of an email",
            },
            handler: async (request, h) => {
                let email = request.query.email;
                let emailDetails = await knex("core_hours")
                    .select()
                    .where("email", email);
                if (emailDetails.length > 0) {
                    emailDetails = emailDetails[0];
                    // console.log(emailDetails);
                    return emailDetails;
                }

                return {
                    ok: false,
                    msge: `No core hours found.`
                };
            }
        },
        // {
        //     method: "GET",
        //     path: "/api/accounts",
        //     config: {
        //         description: "Retrieve all accounts"
        //     },
        //     handler: async (request, h) => {
        //         return knex("accounts").select("email", "firstname", "lastname");
        //     }
        // },
        // {
        //     method: "GET",
        //     path: "/{param*}",
        //     config: {
        //         description: "Production Application"
        //     },
        //     handler: {
        //         directory: {
        //             path: ".",
        //             redirectToSlash: true,
        //             index: true
        //         }
        //     }
        // }
    ]);

    // Start the server.
    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

// Go!
init();
