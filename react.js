
const List = (props) => {
    
    return (
        <ul>
            {props.items.map(i => 
                <li key={i.id}>
                    <span onClick={()=>props.toggleItem && props.toggleItem(i.id)} style={{textDecoration:  i.complete ? 'line-through' : 'none' }}>{i.name}</span>
                    <button onClick={()=>props.remove(i)}>X</button>
                </li>
                
            )
            }
        </ul>
    )
}

class Todos extends React.Component {
    toggleItem = (id) => {
        this.props.dispatch(handleToggleTodo(id))

    }
    addItem = (e) => {
        e.preventDefault();
        const name = this.input.value
        this.props.dispatch(handleAddTodo(name, ()=> this.input.value=''))
        
        }
    removeItem = (i) => {

        this.props.dispatch(handleDeleteTodo(i))
        
        
    }
    render() {
        return (
            <div>
                <h1>Todo List</h1>
                <input
                    type='text'
                    placeholder='Add Todo'
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Todo</button>
                <List items={this.props.todos}
                remove={this.removeItem} 
                toggleItem={this.toggleItem}/>

            </div>
        )
    }
}

class Goals extends React.Component {

    addItem = (e) => {
        e.preventDefault();
        this.props.dispatch(handleAddGoal(this.input.value, ()=>this.input.value = ''))
    }
    removeItem = (i) => {
        this.props.dispatch(handleRemoveGoal(i))
        
    }
    render() {
        return (
            <div>
                <h1>Goals</h1>
                <input
                    type='text'
                    placeholder='Add Goal'
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Goal</button>
                <List items={this.props.goals}
                remove={this.removeItem} />

            </div>
        )
    }
}


class App extends React.Component {

    componentDidMount(){
        this.props.dispatch(handleInitalData())
        store.subscribe(()=>this.forceUpdate())
    }


    render() {
        const { loading } = this.props
       
                    
                    if(loading === true){
                        return <h3>Loading</h3>
                    }
                    return (
                        <div>
                            <ConnectedTodos />
                            <ConnectedGoals  />
                        </div>
            
                    )
                

        
        
    }
}


const ConnectedTodos = ReactRedux.connect((state)=>({
    todos: state.todos
}))(Todos)

const ConnectedApp = ReactRedux.connect((state)=>({
    loading: state.loading
}))(App)

const ConnectedGoals = ReactRedux.connect((state)=>({
    goals: state.goals
}))(Goals)





ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ConnectedApp />
    </ReactRedux.Provider>,
    document.getElementById('app')
)