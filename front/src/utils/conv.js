export function array_table_2_table_struct(arr) {
    console.log("array_table_2_table_struct", arr)
    let table_struct = {
        attrs: [],
        rows: []
    }
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i]
        // console.log("array_table_2_table_struct row", row)
        if (i == 0) {
            table_struct.attrs = row
        } else {
            let row_struct = {}
            for (let coli = 0; coli < row.length; coli++) {
                const value = row[coli]
                row_struct[table_struct.attrs[coli]] = value
            }
            table_struct.rows.push(row_struct)
        }
    }
    console.log(table_struct)
    return table_struct
}