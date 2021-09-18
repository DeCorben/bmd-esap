import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

class Fetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.address || '',
            endpoint: props.endpoint || '',
            output: 'Default placeholder',
        };
    };
    changer = (change)=>{
        let name = change.target.name,
            value = change.target.value
        this.setState({[name]:value})
    };
    componentDidMount = () => {
        this.fetch();
    };
    fetch = () => {
        axios.get(this.state.endpoint)
            .then((res) => res.data)
            .then((raw) => {
                return (<JSONPretty data={raw} />);
            })
            .then((data) => {
                this.setState({ output: data });
            })
            .catch((err) => {
                this.setState({ output: (<JSONPretty data={err}/>) });
            });
    };
    post = ()=> {
        axios.post(this.state.endpoint, JSON.parse(this.state.address))
            .then((res) => {
                this.setState({ output: (<JSONPretty data={res.data}/>) });
            })
            .catch((err) => {
                this.setState({ output: (<JSONPretty data={err}/>) });
            });
    }
    render = () => (<div>
        <div>
            <button onClick={this.fetch}>Get</button>&nbsp;&nbsp;
            <input type="text"
                name="endpoint"
                value={this.state.endpoint}
                onChange={this.changer}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={this.post}>Post</button>&nbsp;&nbsp;
            <input type="text"
                name="address"
                value={this.state.address}
                onChange={this.changer}
            />
        </div>
        {this.state.output}
    </div>);
}

ReactDOM.render(
    <div>
        <Fetcher endpoint="esap/flat" />
    </div>,
    document.getElementById('root')
);
