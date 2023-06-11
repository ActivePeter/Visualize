import axios from 'axios'

const PREV_URL = "/api/"

export async function api_get_table(tablename) {
    return await (await axios.post(PREV_URL + "get_table", { "table_name": tablename })).data
}