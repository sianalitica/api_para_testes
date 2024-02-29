import Config from "./libs/config";
import {addPool} from "./libs/mysqli";

(() => {
    const database = Config.instance().getDatabase();
    addPool({
        alias:"main",
        host:database.host,
        user:database.user,
        pass:database.pass,
        database:database.name
    })
})()
