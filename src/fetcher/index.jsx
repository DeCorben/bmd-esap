import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

class Fetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                if (Array.isArray(raw)) {
                    return (<ul>{raw.map((v, i) => {
                        return (<li key={i}>{v}</li>);
                    })}</ul>);
                }
                if (raw != null && typeof raw === 'object') {
                    return (<JSONPretty data={raw} />);
                }
                return raw;
            })
            .then((data) => {
                this.setState({ output: data });
            })
            .catch((err) => {
                this.setState({ output: JSON.stringify(err,null,'\t') });
            });
    };
    render = () => (<div>
        <div>
            <button onClick={this.fetch}>Fetch</button>
            <input type="text"
                name="endpoint"
                value={this.state.endpoint}
                onChange={this.changer}
            />
        </div>
        {this.state.output}
        <br/>{this.state.endpoint}
    </div>);
}

ReactDOM.render(
    <div>
        <Fetcher endpoint="esap/flat" />
    </div>,
    document.getElementById('root')
);
