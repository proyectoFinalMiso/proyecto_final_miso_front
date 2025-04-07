const apiURI = "https://cr-bff-webapp-488938258128.us-central1.run.app"
// const apiURI = 'http://127.0.0.1:3005'

export const createSeller = async (sellerData: {
    nombre: string;
    email: string;
}): Promise<void> => {
    const url = apiURI + '/api/vendedor/crear_vendedor'
    console.log(sellerData)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sellerData),
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible crear un nuevo vendedor: " + error_msg)
        }

        const data = await response.json()
        console.log("Vendedor creado con éxito:", data)

    } 
    catch (error) {
        console.error("No ha sido posible crear un nuevo vendedor", error)
    }
}