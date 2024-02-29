
class DocList {

    private docs:Doc[] = []
    private doc_info_id:number = 0
    private empresa_id:number = 0
    private categoria:string = ""
    private tipo:string = ""
    private especie:string = ""
    private data_referencia:string = ""
    private data_entrega:string = ""
    private status:number = 0
    private v:number = 0
    private modalidade:string = ""
    private total_docs:number = 0

    constructor(){
        
    }

    toJson(){

    }


}

class Doc {
    
    private texto:string = ""
    private ext:string = ""

}

export default DocList