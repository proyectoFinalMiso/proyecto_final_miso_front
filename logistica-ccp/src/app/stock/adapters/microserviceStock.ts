const apiURI = process.env.NEXT_PUBLIC_BFF_HOST

export const updateStock = async (stockData: {
    id_producto: string;
    cantidad: number;
}): Promise<void> => {
    const url = apiURI + '/api/stock/stock_ingresar_inventario'
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockData),
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