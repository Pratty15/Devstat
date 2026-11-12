function HeatBar({ label, value }) 
{
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="w-full h-2 bg-gray-700 rounded">
        <div
          className={`h-2 rounded ${
            value > 80
              ? "bg-green-500"
              : value > 50
              ? "bg-yellow-400"
              : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default HeatBar;