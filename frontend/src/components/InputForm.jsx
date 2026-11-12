import { useState } from "react";
import { predictUser } from "../services/api";


function InputForm() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const data = await predictUser(username);
    setResult(data.impact || data.error);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>Check</button>

      <h2>{result}</h2>
    </div>
  );
}

export default InputForm;