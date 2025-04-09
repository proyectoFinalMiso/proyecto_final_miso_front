const apiURI = "https://cr-bff-webapp-488938258128.us-central1.run.app"
// const apiURI = "http://192.168.2.8:3097"

export const getManufacturers = async (): Promise<any[]> => {
    const url = apiURI + '/api/productos/listar_fabricantes'
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido listar a los fabricantes: " + error_msg)
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
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar los fabricantes", error)
        return []
    }
}

export const createManufacturer = async (manufacturerData: {
    nombre: string;
    pais: string;
}): Promise<void> => {
    const url = apiURI + '/api/productos/crear_fabricante'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manufacturerData),
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible crear un nuevo fabricante: " + error_msg)
        }

        const data = await response.json()
        console.log("Fabricante creado con éxito:", data)

    } 
    catch (error) {
        console.error("No ha sido posible crear un nuevo fabricante", error)
    }
}