import Config from "../src/libs/config";
import {mysqli, addPool} from "../src/libs/mysqli";
import { QueryDocFull } from "../src/entidades/QueryDoc";

const database = Config.instance().getDatabase();
addPool({
    alias:"main",
    host:database.host,
    user:database.user,
    pass:database.pass,
    database:database.name
})

describe("Teste integrado da biblioteca mysqli com QueryDocs", () => {
    test("QueryDocFull test", async () => {
        const conn = mysqli()
        let query = new QueryDocFull({
            fields:['categoria', 'tipo', 'especie'],
            tipo:"Press-release",
            categoria:"Dados Econômico-Financeiros",
            limit:{
                page:1,
                rows:200
            }
        })
        let res = await conn.query(query.toString()).bind(query.getBind()).exec()
        expect(res.getDataError().code).toBe('NO_ERROR')
    })
})