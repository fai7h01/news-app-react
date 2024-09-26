import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the types for your data
interface CityDto {
    id: number;
    name: string;
    state: string;
    population: string;
}

interface ResponseWrapper<T> {
    success: boolean;
    message: string;
    code: number;
    data: T;
}

const CityList: React.FC = () => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the list of cities from the backend
        axios
            .get<ResponseWrapper<CityDto[]>>("http://localhost:8081/api/v1/city/list")
            .then((response) => {
                if (response.data.success) {
                    setCities(response.data.data); // Set the cities in the state
                } else {
                    setError("Failed to fetch cities");
                }
            })
            .catch((err) => {
                setError("Error fetching cities: " + err.message);
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>City List</h1>
            <ul>
                {cities.map((city) => (
                    <li key={city.id}>{city.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CityList;
