import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../../redux/features/counterSlice"; // ✅ Đúng

function Test() {
  const count = useSelector((state) => state.counter.value); // ❌ Không cần "RootState"
  const dispatch = useDispatch();
  console.log("thannh");

  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <span>{count}</span>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}

export default Test;
