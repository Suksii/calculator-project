import React, {useReducer} from "react";
import DigitButton from "./DigitButton.jsx";
import OperandButton from "./OperandButton.jsx";
import './App.css'

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    ADD_OPERATOR: 'add-operator',
    CLEAR: 'clear',
    DELETE: 'delete',
    EQUAL: 'equal',
    ROOT: 'root'
}
const reducer = (state, { type, payload }) => {
    switch(type) {
        case ACTIONS.ADD_DIGIT:
            if (state.currentOperand.length > 15)
                return state
            if(state.overwriting)
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwriting: false
                }
            if(payload.digit === '0' && state.currentOperand === '0')
                return state
            if(payload.digit === '.' && (state.currentOperand || '').includes('.'))
                return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }
        case ACTIONS.CLEAR:
            return {
                currentOperand: '',
                previousOperand: '',
                operator: null
            }
        case ACTIONS.ADD_OPERATOR:
            if(state.currentOperand === '' && state.previousOperand === '')
                return state
            if(state.currentOperand === '') {
                return {
                    ...state,
                    operator: payload.operator
                }
            }
            if(state.previousOperand === '') {
                return {
                    ...state,
                    operator: payload.operator,
                    previousOperand: state.currentOperand,
                    currentOperand: '',
                    overwriting: false
                }
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operator: payload.operator,
                currentOperand: '',
                overwriting: false
            }
        case ACTIONS.EQUAL:
            if(state.currentOperand === null || state.previousOperand == null || state.operator == null)
                return state
            return {
                ...state,
                previousOperand: '',
                operator: null,
                overwriting: true,
                currentOperand: evaluate(state)
            }
        case ACTIONS.ROOT:
            if(state.currentOperand === '')
                return state
            if(state.currentOperand < 0)
                return {
                    ...state,
                    currentOperand: <div style={{fontSize:'1.3rem'}}>Error: Root of negative number is not allowed</div>
                }
            else
                return {
                    ...state,
                    currentOperand: Math.sqrt(parseFloat(state.currentOperand)).toString()
                }
        case ACTIONS.DELETE:
            if(state.overwriting){
                return {
                    ...state,
                    overwriting: false,
                    currentOperand: null
                }
            }
                if (state.currentOperand == null)
                    return state
                if (state.currentOperand.length === 1){
                    return {
                        ...state,
                        currentOperand: null
                    }
                }
                return {
                    ...state,
                    currentOperand: state.currentOperand.slice(0, -1)
                }
        default:
            return state
            }
}

const evaluate = ({currentOperand, previousOperand, operator}) => {
    const previous = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if(isNaN(previous) || isNaN(current))
        return "";
    let result = "";
    switch(operator) {
        case '+':
            result = previous + current;
            break;
        case '-':
            result = previous - current;
            break;
        case 'x':
            result = previous * current;
            break;
        case '÷':
            result = previous / current;
            break;
        case '%':
            if (current !== 0)
                result = previous / 100 * current;
            else
                return <div style={{fontSize:'1.3rem'}}>Error: Percentage of zero is not allowed</div>
            break;
    }
    if(result.toString().includes('+'))
        return result.toString().replace('e+', '*10^');
    else
        return result.toString();
}
function App() {
    const initialState = {
        previousOperand: '',
        currentOperand: '',
        operator: null
    }
    const [state, dispatch] = useReducer(
        reducer,
        initialState,
undefined
    );

    const { previousOperand, currentOperand, operator } = state;

  return (
      <>
          <h1 className="calculator-title">Online calculator</h1>
            <div className="calculator">
                <div className="calculator-display">
                    <div className="display-values">
                        <div className="previous-operand">{previousOperand} {operator}</div>
                        <div className="current-operand">{currentOperand}</div>
                    </div>
                </div>
                <div className="calculator-keypad">
                        <button onClick={() => dispatch
                        ({ type: 'clear' })}>AC</button>
                        <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
                        <OperandButton operator="%" dispatch={dispatch}/>
                        <button onClick={() => dispatch({ type: ACTIONS.ROOT })}>√</button>
                        <DigitButton digit="7" dispatch={dispatch}/>
                        <DigitButton digit="8" dispatch={dispatch}/>
                        <DigitButton digit="9" dispatch={dispatch}/>
                        <OperandButton operator="÷" dispatch={dispatch}/>
                        <DigitButton digit="4" dispatch={dispatch}/>
                        <DigitButton digit="5" dispatch={dispatch}/>
                        <DigitButton digit="6" dispatch={dispatch}/>
                        <OperandButton operator="x" dispatch={dispatch}/>
                        <DigitButton digit="1" dispatch={dispatch}/>
                        <DigitButton digit="2" dispatch={dispatch}/>
                        <DigitButton digit="3" dispatch={dispatch}/>
                        <OperandButton operator="-" dispatch={dispatch}/>
                        <DigitButton digit="0" dispatch={dispatch}/>
                        <DigitButton digit="." dispatch={dispatch}/>
                        <button onClick={() => dispatch({ type: ACTIONS.EQUAL })}>=</button>
                        <OperandButton operator="+" dispatch={dispatch}/>
                </div>
            </div>
        </>
  )
}
export default App
