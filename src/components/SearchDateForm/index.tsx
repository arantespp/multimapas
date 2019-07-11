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
        console.log("Chmando o formulario de data");
        /* Teste: NU_NOTIFIC: 5409674	DT_NOTIFIC: 06/11/2018 - 43410 */

        if (this.initialDateRef && this.initialDateRef.current &&
            this.finalDateRef && this.finalDateRef.current) {

            let finalDate, initialDate = moment(this.initialDateRef.current.value).format('L');

            if (this.finalDateRef.current.value !== '')
                finalDate = moment(this.finalDateRef.current.value).locale('pt-BR').format('L');
            
            console.log(this.props)

            /*console.log(this.props.data[0].DT_NOTIFIC);*/
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
                        <input type="date" required ref={this.initialDateRef} />
                    </label>
                    <label>
                        Final:
                        <input type="date" ref={this.finalDateRef} />
                    </label>
                    <input type="submit" value="Pesquisar" className="search-submit-button" />
                </form>
            </div>
        );
    }


}