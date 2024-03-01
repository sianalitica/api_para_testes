import Service from "../src/services/Service"
import documents from "../src/services/documents"
import Config from "../src/libs/config";
import {addPool} from "../src/libs/mysqli";

const database = Config.instance().getDatabase();
addPool({
    alias:"main",
    host:database.host,
    user:database.user,
    pass:database.pass,
    database:database.name
})

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


describe("serviço documents", () => {
    test("Lista de documentos com erro", () => {
        const resp = Service.createServiceByVars({
            body:{
                categoria:['uma', 'outra'] // valor incorreto
            }
        }, async (service:Service) => {
            const res = await documents.getListDocuments(service)
            if(res)
            expect(res.code).toBe(500)
        })
        
    })
    test("Lista de documentos retornando vazio", () => {
        const resp = Service.createServiceByVars({
            body:{
                data_ref:1 // valor incorreto
            }
        }, async (service:Service) => {
            const res = await documents.getListDocuments(service)
            if(res){
                expect(res.body.length).toBe(0)
            }
            
        })
        
    })
    test("Lista de categorias", () => {
        const resp = Service.createServiceByVars({
            body:{
                data_ref:1 // valor incorreto
            }
        }, async (service:Service) => {
            const res = await documents.getCategorias(service)
            if(res){
                expect(res.body.length).toBeGreaterThan(0)
            }
            
        })
        
    })
    test("pegar documento por id corretamente", () => {
        const resp = Service.createServiceByVars({
            query:{
                docId:1
            }
        }, async (service:Service) => {
            const res = await documents.getDoc(service)
            if(res){
                expect(res.body.length).toBeGreaterThan(0)
            }
            
        })
    })
})