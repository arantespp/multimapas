import React, { Component, SyntheticEvent } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Data } from '../../interfaces';

import './styles.scss';

interface Props {
    data: Data[];
}

export default class SearchDateForm extends Component<Props> {

    private initialDateRef: React.RefObject<HTMLInputElement>;
    private finalDateRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);
        this.initialDateRef = React.createRef();
        this.finalDateRef = React.createRef();
    }

    searchDate(event: SyntheticEvent) {
        event.preventDefault();
                
        if (this.initialDateRef && this.initialDateRef.current &&
            this.finalDateRef && this.finalDateRef.current) {
            
            const initialDate = moment(this.initialDateRef.current.value);
            let dataFound;

            if (this.finalDateRef.current.value) {
                const finalDate = moment(this.finalDateRef.current.value);
                finalDate.add(1,'day'); //??????               
                
                dataFound = this.props.data.filter(data => data.dtNotific && data.dtNotific.isBetween(initialDate, finalDate, undefined, "[]"));

            } else {
                dataFound = this.props.data.filter(data => data.dtNotific && data.dtNotific.isSameOrAfter(initialDate));                
            }

            this.setState({data:dataFound});
                                   
            this.resetInputs();
        }
    }

    private resetInputs() {
        if (this.initialDateRef.current !== null && this.finalDateRef.current !== null) {
            this.initialDateRef.current.value = '';
            this.finalDateRef.current.value = '';
        }
    }

    render() {
        return (
            <div>
                <form className="search-date" onSubmit={this.searchDate.bind(this)}>
                    <label>
                        Inicial:
                        <input type="date" required ref={this.initialDateRef} max="2018-12-31" min="2018-01-01"/>
                    </label>
                    <label>
                        Final:
                        <input type="date" ref={this.finalDateRef} max="2018-12-31" min="2018-01-01" />
                    </label>
                    <input type="submit" value="Pesquisar" className="search-submit-button" />
                </form>
            </div>
        );
    }


}