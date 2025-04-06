// import { createSeller } from '@/app/sellers/adapters/microserviceSeller';

// global.fetch = jest.fn();

// describe('createSeller', () => {
//     const mockSellerData = {
//         nombre: 'John Doe',
//         email: 'john.doe@example.com',
//     };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     // it('should send a POST request with the correct data', async () => {
//     //     // Arrange
//     //     const mockResponse = {
//     //         ok: true,
//     //         json: jest.fn().mockResolvedValue({ message: 'Success' }),
//     //     };
//     //     (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
//     //     const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

//     //     // Act
//     //     await createSeller(mockSellerData);

//     //     // Assert
//     //     expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:3005/crear_vendedor', {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify(mockSellerData),
//     //     });
//     //     expect(consoleLogSpy).toHaveBeenCalledWith('Vendedor creado con éxito:', { message: 'Success' });
//     // });

//     // it('should throw an error if the response is not ok', async () => {
//     //     // Arrange
//     //     const mockErrorMessage = 'Error creating seller';
//     //     const mockResponse = {
//     //         ok: false,
//     //         text: jest.fn().mockResolvedValue(mockErrorMessage),
//     //     };
//     //     (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
//     //     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

//     //     // Act & Assert
//     //     await expect(createSeller(mockSellerData)).rejects.toThrow(
//     //         `No ha sido posible crear un nuevo vendedor: ${mockErrorMessage}`
//     //     );
//     //     expect(consoleErrorSpy).toHaveBeenCalledWith(
//     //         'No ha sido posible crear un nuevo vendedor',
//     //         expect.any(Error)
//     //     );
//     // });

//     // it('should log an error if an exception occurs', async () => {
//     //     // Arrange
//     //     const mockError = new Error('Network Error');
//     //     (fetch as jest.Mock).mockRejectedValueOnce(mockError);
//     //     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

//     //     // Act
//     //     await createSeller(mockSellerData);

//     //     // Assert
//     //     expect(consoleErrorSpy).toHaveBeenCalledWith(
//     //         'No ha sido posible crear un nuevo vendedor',
//     //         mockError
//     //     );
//     // });
// });