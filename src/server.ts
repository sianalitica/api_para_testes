import mysqli from "./libs/mysqli";

(async () => console.log(await mysqli("select count(*) from documentos_info").exec()))()