import { useState } from "react";


export function UserMoney() {
  const [money, setMoney] = useState(100);

  return (
    <div>
      <button onClick={() => setMoney(money + 1)}>+</button>
      <span>Money: {money}</span>
      <button onClick={() => setMoney(money - 1)}>-</button>
    </div>
  );
}