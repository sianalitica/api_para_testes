import Config from "./config";
import { createPool } from "mysql";
import QueryFunc from "../entidades/Query.ts";

const database = Config.instance().getDatabase()

abstract class ResponseQuery {}

class SuccessQuery extends ResponseQuery { }

class ErrorQuery extends ResponseQuery {}

class MySQLi {
    
    private conn = createPool({
        host:database.host,
        user:database.user,
        password:database.pass,
        port:database.port,
        database:database.name,
        insecureAuth:false
    })

    private querystr

    constructor(query:string|QueryFunc){
        this.querystr = query instanceof QueryFunc ? query.getQuery() : query
    }

    async exec():Promise<ResponseQuery> {
        return new Promise((resolve, reject) => {
            try {
                this.conn.query(this.querystr, (err,res) => {
                    console.log(err,res);
                    
                    if(err) return resolve(new ErrorQuery())
                    return resolve(new SuccessQuery())
                })
            } catch(e) {
                return resolve(new ErrorQuery())
            }
        })
            
    }

}

export default (query:string|QueryFunc) => new MySQLi(query)

