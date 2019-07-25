import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: 5
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    checkBox: {
        margin: '-12px 0 0 !important'
        
    },
    formControlDate: {
        marginLeft: '5px !important',
        marginRight: '3px !important'
    },
    formControlSelect: {
        minWidth: '200px !important',
        margin: '5px 3px 10px 5px !important'
    }
}));