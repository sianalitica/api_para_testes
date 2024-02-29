import { Request, Response } from "express";

interface variaveis {
    body?:object,
    query?:object,
    header?:object
}

interface service_callback {
    (callback:Service):void
}

class Service {

    private resp?:Response
    private body?:object
    private query?:object
    private header?:object

    private constructor(){}

    static async createServiceByRequest(req:Request, res:Response, callback:service_callback){
        
        const service    = new Service()
        service.resp     = res
        service.body     = req.body 
        service.query    = req.query 
        service.header   = req.headers

        await callback(service)

    }

    static async createServiceByVars(vars:variaveis, callback:service_callback){
        
        const service    = new Service()
        service.body     = vars.body
        service.query    = vars.query 
        service.header   = vars.header

        await callback(service)

    }

    getBody(){ return this.body }

    getHeader(){ return this.header }

    getQuery(){ return this.query }

    response(body?:any, code=200, message=""){
        let res = {code:code, body:body, message:message}
        if(this.resp){
            // comita a resposta
            this.resp.send(res)
        } else {
            return res
        }
    }


}


export default Service