const apiURI = "https://cr-bff-webapp-488938258128.us-central1.run.app"

export const insertStock = async (productData: { //'nombre', 'bodega', 'posicion', 'lote', 'cantidad', 'sku', 'valorUnitario'
    nombre: string; //nombre producto
    bodega: string; //id bodega
    posicion: string; //id posicion
    lote: string; //lote
    cantidad: string; //cantidad
    sku: string; //sku
    valorUnitario: string; //valor unitario
}): Promise<void> => {
    const url = apiURI + '/api/bodega/stock_crear_producto'

    // const url = 'http://127.0.0.1:3006/stock_crear_producto'
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible crear un nuevo stock: " + error_msg)
        }

        const data = await response.json()
        console.log("Stock creado con éxito:", data)

    } 
    catch (error) {
        console.error("No ha sido posible crear un nuevo stock", error)
    }
}

export const getProducts = async (): Promise<any[]> => {
    const url = apiURI + '/api/productos/listar_productos'
    
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible listar los productos: " + error_msg)
        }
        
        const data = await response.json()
        // console.log(data)
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar los productos", error)
        return []
    }
}

export const getBodega = async (): Promise<any[]> => {
    const url = apiURI + '/api/bodega/listar_bodegas'

    // const url = 'http://127.0.0.1:3006/listar_bodegas'

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible listar las bodegas: " + error_msg)
        }
        
        const data = await response.json()
        console.log(data)
        return data.bodegas || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar las bodegas", error)
        return []
    }
}

export const getStock = async (): Promise<any[]> => {
    const url = apiURI + '/api/bodega/stock_listar_inventarios'

    // const url = 'http://127.0.0.1:3006/stock_listar_inventarios'

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible listar el inventario: " + error_msg)
        }
        
        const data = await response.json()
        console.log(data)
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar el inventario", error)
        return []
    }
}