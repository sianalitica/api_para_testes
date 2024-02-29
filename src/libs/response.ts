import { Response } from "express"

interface resp {
    message:any,
    session?:String
}

export default (res:Response) => {

    return {

        success: (message:any = "") => {
            let resp:resp = { message: message }
            res.json(resp)
        },
        
        error: (code:number = 404, message:any = "") => res.status(code).json({ message:message }).end(),

    }

}