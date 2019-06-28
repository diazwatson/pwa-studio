import React from 'react';
import { bool, node, shape, string } from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit-2';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './section.css';

const editIconAttrs = {
    color: 'black',
    width: 18
};
const EDIT_ICON = <Icon src={EditIcon} attrs={editIconAttrs} />;

const Section = props => {
    const {
        children,
        classes: propClasses,
        label,
        showEditIcon = false,
        ...restProps
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const icon = showEditIcon ? EDIT_ICON : null;

    return (
        <button className={classes.root} {...restProps}>
            <span className={classes.content}>
                <span className={classes.label}>
                    <span>{label}</span>
                </span>
                <span className={classes.summary}>{children}</span>
                <span className={classes.icon}>{icon}</span>
            </span>
        </button>
    );
};

Section.propTypes = {
    classes: shape({
        content: string,
        icon: string,
        label: string,
        root: string,
        summary: string
    }),
    label: node,
    showEditIcon: bool
};

export default Section;
