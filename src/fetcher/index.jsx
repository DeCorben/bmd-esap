import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';

class Fetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: props.endpoint || '',
            output: 'Default placeholder',
        };
    };
    componentDidMount = () => {
        this.fetch();
    };
    fetch = () => {
        axios.get(this.state.endpoint)
            .then((res) => res.data)
            .then((raw) => {
                if (Array.isArray(raw)) {
                    return (<ul>{raw.map((v) => {
                        return (<li>{v}</li>);
                    })}</ul>);
                }
                if (raw != null && typeof raw === 'object') {
                    return JSON.stringify(raw,null,'\t');
                    //created nested list from object
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
        {this.state.output}
        <br/>{this.state.endpoint}
    </div>);
}

ReactDOM.render(
    <div>
        <Fetcher endpoint="esap/nest" />
    </div>,
    document.getElementById('root')
);
