const apiURI = process.env.NEXT_PUBLIC_BFF_HOST

export const createProduct = async (productData: {
    nombre: string;
    valorUnitario: number;
    fabricante: string;
    volumen: number;
}): Promise<void> => {
    const url = apiURI + '/api/productos'

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