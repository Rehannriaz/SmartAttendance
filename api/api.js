import React from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const api = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return <div>api</div>;
};
export default api;
