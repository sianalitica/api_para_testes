import Config from "../src/libs/config";
import {mysqli, addPool} from "../src/libs/mysqli";

const database = Config.instance().getDatabase();
addPool({
    alias:"main",
    host:database.host,
    user:database.user,
    pass:database.pass,
    database:database.name
})

let conect = mysqli()
conect.query("create table if not exits test (valor varchar(255) not null)").exec()


describe("teste bilbioteca mysqli", () => {

    test("teste usando a mesma query para consultas com valores diferente", async ()=> {
        const conn = mysqli()
        conn.query("select * from test where valor = ?")
        let res1 = await conn.bind(['test1']).exec<{valor:string}>()
        let res2 = await conn.bind(['test2']).exec<{valor:string}>()
        expect(res1.status()).toBe(true)
        expect(res2.status()).toBe(true)
    })

    test("teste com mais de uma colsulta direferente em tabelas distintas na mesma conexão", async () => {
        
        const conn = mysqli()
        let res3 = await conn.query("select * from test").exec<{valor:string}>()
        expect(res3.status()).toBe(true)

        let values = [
            ['test3'],
            ['test4']
        ]
        let res4 = await conn.query("insert into test(valor) values ?").bind([values]).exec()
        expect(res4.status()).toBe(true)
        
        let res5 = await await conn.query("select count(*) from test where valor = ?").bind(['test4']).exec()
        expect(res5.status()).toBe(true)

    })

    test("teste com tabelas de campos únicos", async () => {
        
        const conn = mysqli()

        let emailres = await conn.query("insert into emails(email) values (?)").bind(['test@email.com']).exec()
        
        if(!emailres.status()){
            expect(emailres.getDataError().code).toBe('ER_DUP_ENTRY')
        }
    })

    test("testes com erros genérios do mysql", async () => {
        
        const conn = mysqli()
        let tabelanaoexiste = await conn.query("insert into tabela_fake (field_fake) values (?)").bind(['fake']).exec()
        expect(tabelanaoexiste.getDataError().code).toBe('ER_NO_SUCH_TABLE')
        
    })
    
})