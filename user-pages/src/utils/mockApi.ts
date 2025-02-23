let isLoading = false;

export const searchActivities = async (query: string): Promise<string[]> => {
    if (isLoading || query.length < 4) {
        return [];
    }

    try {
        isLoading = true;
        console.log('Sending request for query:', query);
        
        const response = await fetch('http://localhost:5000/noai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Query: query })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching activities:', error);
        return [];
    } finally {
        isLoading = false;
        console.log('Request completed, ready for next request');
    }
};

export const getIsLoading = () => isLoading;
