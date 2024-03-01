import { QueryDocFull } from "../src/entidades/QueryDoc"


describe("test query", () => {

    test("testando query simples", () => {
        let query = new QueryDocFull({})
        console.log(query.toString())
    })

    test("testando query elaboradas", () => {
        let query = new QueryDocFull({
            fields:['categoria', 'tipo', 'especie'],
            tipo:"Press-release",
            categoria:"Dados Econômico-Financeiros",
            limit:{
                page:2,
                rows:200
            }
        })
        console.log(query.toString())
        console.log(query.getBind())
    })

})