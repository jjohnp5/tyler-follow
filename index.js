
// {
//     type: 'REMOVE_TODO',
//     id: 0
// }
// {
//     type: 'TOGGLE_TODO',
//     id: 0
// }
// {
//     type: 'ADD_GOAL',
//     goal: {
//         id: 0,
//         name: 'Run a Marathon'
//     }
// }
// {
//     type: 'REMOVE_GOAL',
//     id: 0
// }
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'
const RECEIVE_DATA = 'RECEIVE_DATA'

function generateId(){
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

function addTodoAction(todo){
    return {
        type: ADD_TODO,
        todo
    }
}
function removeTodoAction(id){
    return {
        type: REMOVE_TODO,
        id
    }
}
function toggleTodoAction(id){
    return {
        type: TOGGLE_TODO,
        id
    }
}
function addGoalAction(goal){
    return {
        type: ADD_GOAL,
        goal
    }
}
function removeGoalAction(id){
    return {
        type: REMOVE_GOAL,
        id
    }
}
function handleDeleteTodo(i){
    return (dispatch)=>{
        dispatch(removeTodoAction(i.id))
        return API.deleteTodo(i.id)
            .catch(()=>{
                dispatch(addTodoAction(i))
                alert('an error occured');
            })
    }
    
}
function handleToggleTodo(id){
    return (dispatch) => {
        dispatch(toggleTodoAction(id))
        return API.saveTodoToggle(id)
            .catch(()=>{
                dispatch(toggleTodoAction(id))
                alert('error toggling todo.')
            })
    }
}

function handleAddTodo(name, e){
    return (dispatch) => {
        return API.saveTodo(name)
            .then((todo)=>{
                dispatch(addTodoAction(todo))
                e()
            }).catch(()=>{
                e()
                alert('Error adding todo.')
            })
    }
}
function handleAddGoal(goal, e){
    return (dispatch) => {
        return API.saveGoal(goal)
            .then(g=>{
                dispatch(addGoalAction(g))
                e()
            }).catch(()=>{
                e()
                alert('Error adding goal');
                
            })
    }
}
function handleRemoveGoal(i){
    return (dispatch) => {
        dispatch(removeGoalAction(i.id))
        return API.deleteGoal(i.id)
            .catch(()=>{
                dispatch(addGoalAction(i))
                alert('An error Occured deleting goal')
            })
    }
}

function handleInitalData(){
    return (dispatch) => {
        Promise.all([
            API.fetchTodos(),
            API.fetchGoals()
        ]).then(([todos, goals])=>{
            dispatch(receivedDataAction(todos,goals))
        })
        
    }
}

const checker = store => next => action =>{
    if(action.type === ADD_TODO && action.todo.name.toLowerCase().indexOf('bitcoin') !== -1){
        return alert('Nope. Bad Idea');
    }
    if(action.type === ADD_GOAL && action.goal.name.toLowerCase().indexOf('bitcoin') !== -1){
        return alert('Nope. Bad Idea');
    }

    return next(action);
}

const logger = store => next => action => {
    console.group(action.type);
    console.log('The action:', action);
    const result = next(action);
    console.log('The new state: ', store.getState());
    console.groupEnd()
    return result;
}


function todos(state = [], action){
    switch(action.type){
        case 'ADD_TODO':
            return state.concat([action.todo])
        case 'REMOVE_TODO':
            return state.filter(todo=>
                todo.id !== action.id
            )
        case 'TOGGLE_TODO':
            return state.map(todo=>{
                if(todo.id === action.id){
                    return {...todo, complete: !todo.complete}
                }
                return todo;
            })
        case 'RECEIVE_DATA':
            return action.todos
        default:        
            return state
}
}
function goals(state =[], action){
    switch(action.type){
        case 'ADD_GOAL':
            return state.concat([action.goal])
        case 'REMOVE_GOAL' :
            return state.filter(goal=>
                goal.id !== action.id
            )
        case 'RECEIVE_DATA':
            return action.goals
        default:
            return state;
    }
}

function loading(state=true, action){
    switch(action.type){
        case 'RECEIVE_DATA':
            return false
        default:
            return state;
    }
}


let store = Redux.createStore(Redux.combineReducers({
    todos,
    goals,
    loading
}), Redux.applyMiddleware(checker, logger, ReduxThunk.default));




function addTodo(){
    const input = document.querySelector('#todo');
    const name = input.value;
    input.value = '';
    store.dispatch(addTodoAction({
        id: generateId(),
        name: name,
        complete: false
    }))
}
function addGoal(){
    const input = document.querySelector('#goal');
    const name = input.value;
    input.value = '';
    store.dispatch(addGoalAction({
        id: generateId(),
        name: name,
    }))
}

function receivedDataAction(todos,goals){
    return {
        type: RECEIVE_DATA,
        todos,
        goals
    }
}


