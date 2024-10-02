import React, {useEffect, useState} from "react";
import axios from "axios";

// Define the types for data
interface CityDto {
    id: number;
    name: string;
    state: string;
    population: string;
}

interface NewsDto {
    id: number;
    author: string
    title: string;
    description: string;
    content: string;
    url: string;
    city: CityDto
    isLocal: boolean;
}

interface ResponseWrapper<T> {
    success: boolean;
    message: string;
    code: number;
    data: T;
}

const CityNews: React.FC = () => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [news, setNews] = useState<NewsDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the list of cities from the backend
        axios
            .get<ResponseWrapper<CityDto[]>>("https://news-app-b06j.onrender.com/api/v1/city/list")
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

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCityId(Number(event.target.value)); // Store selected city ID
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        if (selectedCityId === null) {
            alert("Please select a city first!");
            return;
        }

        // Fetch news for the selected city
        axios
            .get<ResponseWrapper<NewsDto>>(`https://news-app-b06j.onrender.com/api/v1/news/search/${selectedCityId}`)
            .then((response) => {
                if (response.data.success) {
                    setNews(response.data.data); // Set the news in the state
                } else {
                    setError("Failed to fetch news");
                }
            })
            .catch((err) => {
                setError("Error fetching news: " + err.message);
            });
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='main'>
            <div className='header'>
                <h1>City News</h1>
            </div>

            <div className='form'>
                <form onSubmit={handleSubmit} className='dropdown'>
                    <label htmlFor="city">Select a city: </label>
                    <select id="city" onChange={handleCityChange} value={selectedCityId ?? ""}>
                        <option value="">-- Choose a City --</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className='submit'>Get News</button>
                </form>
            </div>

            {news && (
                <div className='article'>
                    <h2>Article</h2>
                    <h3>Title: {news.title}</h3>
                    <p>Description: {news.description}</p>
                    <p>Content: {news.content}</p>
                </div>
            )}
        </div>
    );
};

export default CityNews;
