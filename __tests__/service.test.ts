import Service from "../src//services/Service"

describe("teste de serviços", () => {
    test("classe serviço", () => {
        Service.createServiceByVars({}, 
            (serv:Service) => {
                serv.response({
                    "ola":"mundo"
                })
            }
        )
    })
})