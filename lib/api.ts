export interface Transaction {
    id: string;
    description: string;
    // Các thuộc tính khác mà API trả về
  }
  
  export async function getTransactionData(): Promise<Transaction[] | null> {
    const apiToken = 'GMSJXHNUZMXIKMV95TZ3D7UNAZ6SHBW09WPTUEYEVLIS2DUCO24A3CZYLKBRHO1R';
  
    try {
      const response = await fetch('https://api.sepay.com/v1/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: Transaction[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      return null;
    }
  }
  