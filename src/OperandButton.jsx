import {ACTIONS} from './App.jsx'
const OperandButton = ({ dispatch, operator }) => {
    return (
        <button onClick={() => dispatch({ type: ACTIONS.ADD_OPERATOR, payload: { operator }})}>{operator}</button>
    )
}
export default OperandButton