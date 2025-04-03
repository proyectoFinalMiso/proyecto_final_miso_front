const apiURI = process.env.NEXT_PUBLIC_BFF_HOST

export const createProduct = async (productData: {
    nombre: string;
    valorUnitario: number;
    id_fabricante: string;
    volumen: string;
}): Promise<void> => {
    const url = apiURI + '/api/productos/producto/crear_producto'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if(!response.ok) {
            throw new Error("No ha sido posible crear un nuevo producto")
        }

        const data = await response.json()
        console.log("Producto creado con éxito:", data)

    } 
    catch (error) {
        console.error("No ha sido posible crear un nuevo producto", error)
    }
}

export const getManufacturers = async (): Promise<any[]> => {
    const url = apiURI + '/api/productos/fabricante/listar_fabricantes'
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            throw new Error("No ha sido posible listar los fabricantes")
        }

        const data = await response.json()
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar los fabricantes", error)
        return []
    }
}

export const getProducts = async (): Promise<any[]> => {
    const url = apiURI + '/api/productos/producto/listar_productos'
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            throw new Error("No ha sido posible listar los fabricantes")
        }

        const data = await response.json()
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar los fabricantes", error)
        return []
    }
}